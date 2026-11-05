import type { Operation, Page, Receipt, Store } from './store';

export type Gateway = { push(op: Operation): Promise<Receipt>; pull(cursor: number, highWater?: number): Promise<Page> };

export async function synchronize(store: Store, gateway: Gateway, active: () => boolean, changed: () => void) {
  // Push first so an acknowledged-but-lost response is replayed before its own change feed is read.
  for (let i = 0; i < 100 && active(); i++) {
    const op = store.next();
    if (!op) break;
    const receipt = await gateway.push(op);
    if (!active()) return;
    store.acknowledge(op, receipt);
    changed();
  }
  let highWater: number | undefined;
  while (active()) {
    const page = await gateway.pull(store.cursor, highWater);
    if (!active()) return;
    store.applyPage(page);
    changed();
    highWater = page.highWater;
    if (page.cursor >= highWater) return;
  }
}
