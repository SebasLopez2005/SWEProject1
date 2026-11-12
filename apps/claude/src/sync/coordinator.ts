// SyncCoordinator: pushes the durable outbox one aggregate operation at a
// time, then pulls the owner's ordered change feed. Runs on foreground,
// reconnect, local change and manual retry while the app is active.
import type { SyncStatus } from '../domain/types';
import type { Repository } from '../data/repository';
import { AuthExpiredError, NetworkError, type SyncGateway } from './gateway';

export interface SyncState {
  status: SyncStatus;
  running: boolean;
  pending: number;
  conflicts: number;
  lastSyncAt: string | null;
  lastError: string | null;
}

export class SyncCoordinator {
  private running: Promise<void> | null = null;
  private again = false;
  private listeners = new Set<(s: SyncState) => void>();
  state: SyncState = { status: 'saved_on_device', running: false, pending: 0, conflicts: 0, lastSyncAt: null, lastError: null };
  private needsSignIn = false;
  private stopped = false;

  constructor(private repo: Repository, private gateway: SyncGateway | null) {}

  subscribe(fn: (s: SyncState) => void) {
    this.listeners.add(fn);
    fn(this.state);
    return () => this.listeners.delete(fn);
  }

  private emit(patch: Partial<SyncState>) {
    this.state = { ...this.state, ...patch };
    for (const fn of this.listeners) fn(this.state);
  }

  stop() {
    this.stopped = true;
  }

  setNeedsSignIn(v: boolean) {
    this.needsSignIn = v;
    void this.refreshStatus();
  }

  async refreshStatus(): Promise<void> {
    const c = await this.repo.outboxCounts();
    let status: SyncStatus;
    if (!this.gateway) status = 'device_only';
    else if (this.needsSignIn) status = 'needs_sign_in';
    else if (c.conflicts > 0) status = 'needs_attention';
    else if (c.pending + c.blocked > 0) status = 'waiting';
    else status = 'uploaded';
    this.emit({ status, pending: c.pending + c.blocked, conflicts: c.conflicts });
  }

  /** Coalesces concurrent triggers into at most one follow-up run. */
  syncNow(): Promise<void> {
    if (!this.gateway || this.stopped) return this.refreshStatus();
    if (this.running) {
      this.again = true;
      return this.running;
    }
    this.running = (async () => {
      this.emit({ running: true });
      try {
        do {
          this.again = false;
          await this.runOnce();
        } while (this.again && !this.stopped);
      } finally {
        this.running = null;
        this.emit({ running: false });
        await this.refreshStatus();
      }
    })();
    return this.running;
  }

  private async runOnce(): Promise<void> {
    const gw = this.gateway!;
    try {
      const skip = new Set<string>();
      for (let i = 0; i < 500 && !this.stopped; i++) {
        const op = await this.repo.nextReadyOp(skip);
        if (!op) break;
        let result;
        try {
          result = await gw.applyMutation(op);
        } catch (e) {
          await this.repo.markAttempt(op.seq, String((e as Error).message));
          throw e;
        }
        await this.repo.markAttempt(op.seq, result.status === 'applied' ? null : result.status);
        if (result.status === 'applied') await this.repo.ack(op, result.revision);
        else if (result.status === 'conflict') await this.repo.preserveConflict(op, result.remote, result.revision, result.reason);
        else if (result.status === 'rejected') await this.repo.preserveConflict(op, null, op.baseRevision, `rejected: ${result.reason}`);
        else skip.add(op.aggregateId); // retry later (e.g. referenced record not uploaded yet)
      }
      let cursor = await this.repo.getCursor();
      for (let i = 0; i < 100 && !this.stopped; i++) {
        const page = await gw.pullChanges(cursor);
        await this.repo.applyPulledPage(page.events, page.nextCursor);
        cursor = page.nextCursor;
        if (!page.hasMore) break;
      }
      this.needsSignIn = false;
      this.emit({ lastSyncAt: new Date().toISOString(), lastError: null });
    } catch (e) {
      if (e instanceof AuthExpiredError) {
        this.needsSignIn = true;
        this.emit({ lastError: 'Your session expired. Sign in again to upload; your work stays saved on this device.' });
      } else if (e instanceof NetworkError) {
        this.emit({ lastError: 'Offline or server unreachable. Your work is saved on this device and will upload automatically.' });
      } else {
        this.emit({ lastError: String((e as Error).message ?? e) });
      }
    }
  }
}
