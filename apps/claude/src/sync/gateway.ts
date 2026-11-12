import type { SupabaseClient } from '@supabase/supabase-js';
import type { AggregateKind } from '../domain/types';
import type { ChangeEvent, OutboxOp } from '../data/repository';

export type MutationResult =
  | { status: 'applied'; revision: number; duplicate?: boolean }
  | { status: 'conflict'; reason: string; revision: number; remote: any | null }
  | { status: 'rejected'; reason: string }
  | { status: 'retry'; reason: string };

export interface PullPage {
  events: ChangeEvent[];
  nextCursor: number;
  hasMore: boolean;
}

export class NetworkError extends Error {}
export class AuthExpiredError extends Error {}

export interface SyncGateway {
  applyMutation(op: OutboxOp): Promise<MutationResult>;
  pullChanges(since: number, limit?: number): Promise<PullPage>;
}

function classify(error: any): never {
  const msg = String(error?.message ?? error);
  const code = String(error?.code ?? '');
  if (code === '28000' || code === 'PGRST301' || code === 'PGRST303' || /JWT|not authenticated|expired/i.test(msg)) throw new AuthExpiredError(msg);
  if (/Network request failed|fetch failed|Failed to fetch|timeout|ECONNREFUSED|ENOTFOUND|network/i.test(msg)) throw new NetworkError(msg);
  throw new NetworkError(msg); // unknown transport failures are retried, never treated as success
}

/** Calls the authenticated Supabase RPCs. Never reports success without a server receipt. */
export class SupabaseSyncGateway implements SyncGateway {
  constructor(private client: SupabaseClient) {}

  async applyMutation(op: OutboxOp): Promise<MutationResult> {
    let res;
    try {
      res = await this.client.rpc('apply_mutation', {
        p_operation_id: op.operationId,
        p_kind: op.kind,
        p_aggregate_id: op.aggregateId,
        p_base_revision: op.baseRevision,
        p_payload: JSON.parse(op.payload),
        p_payload_hash: op.payloadHash,
        p_timezone: op.timezone,
        p_schema_version: op.schemaVersion,
      });
    } catch (e) {
      classify(e);
    }
    if (res.error) classify(res.error);
    const data = res.data as any;
    if (!data || typeof data.status !== 'string') throw new NetworkError('Unexpected response');
    return data as MutationResult;
  }

  async pullChanges(since: number, limit = 200): Promise<PullPage> {
    let res;
    try {
      res = await this.client.rpc('pull_changes', { p_since: since, p_limit: limit });
    } catch (e) {
      classify(e);
    }
    if (res.error) classify(res.error);
    const data = res.data as any;
    return {
      events: (data.events ?? []).map((e: any) => ({ cursor: Number(e.cursor), kind: e.kind as AggregateKind, aggregateId: e.aggregateId, revision: e.revision, snapshot: e.snapshot })),
      nextCursor: Number(data.nextCursor ?? since),
      hasMore: !!data.hasMore,
    };
  }
}
