import catalog from './catalog.json';
import type { ExerciseType } from '../domain/types';
import { normalizeName } from '../domain/validation';
import type { DB } from './db';

export interface CatalogRecord {
  id: string;
  src: string;
  name: string;
  type: ExerciseType;
  cat: string;
  eq: string;
  pm: string[];
  sm: string[];
  ins: string;
  img: string[];
}

export const CATALOG_RELEASE = catalog.release as { sourceRevision: string; sha256: string; license: string; source: string; mediaBase: string };
/** Bump when the seeded columns change so existing installs re-merge by stable ID. */
const SEED_VERSION = `${CATALOG_RELEASE.sha256}:media-v1`;
export const CATALOG: CatalogRecord[] = catalog.exercises as CatalogRecord[];

/**
 * Merge the pinned catalog by stable mapped ID. Existing IDs keep resolving in
 * prior workouts and routines; only descriptive metadata is refreshed.
 */
export function mediaUrls(paths: string[]): string[] {
  return paths.map((p) => `${CATALOG_RELEASE.mediaBase}${p.split('/').map(encodeURIComponent).join('/')}`);
}

export async function seedCatalog(db: DB): Promise<void> {
  const row = await db.first<{ value: string }>("SELECT value FROM meta WHERE key = 'catalog_release'");
  if (row?.value === SEED_VERSION) return;
  await db.tx(async () => {
    for (let i = 0; i < CATALOG.length; i += 50) {
      const chunk = CATALOG.slice(i, i + 50);
      const params = chunk.flatMap((e) => [e.id, e.name, normalizeName(e.name), e.type, e.cat, e.eq, JSON.stringify(e.pm), JSON.stringify(e.sm), e.ins, e.src, JSON.stringify(e.img ?? [])]);
      await db.run(
        `INSERT INTO exercises (id, owner_id, name, normalized_name, type, category, equipment, primary_muscles, secondary_muscles, instructions, source_id, media)
         VALUES ${chunk.map(() => '(?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ')}
         ON CONFLICT(id) DO UPDATE SET name = excluded.name, normalized_name = excluded.normalized_name, category = excluded.category,
           equipment = excluded.equipment, primary_muscles = excluded.primary_muscles, secondary_muscles = excluded.secondary_muscles,
           instructions = excluded.instructions, source_id = excluded.source_id, media = excluded.media`,
        params,
      );
    }
    await db.run("INSERT OR REPLACE INTO meta (key, value) VALUES ('catalog_release', ?)", [SEED_VERSION]);
  });
}
