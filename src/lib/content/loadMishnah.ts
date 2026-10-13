// Build-time-only content loader (reads committed JSON from disk). Never
// imported by client-side code, so Node's fs is safe to use here. The
// client-side Mishnah-by-name feature fetches the same files over HTTP
// instead (see src/lib/mishnahByName/fetchMishnahText.ts) since they live
// under public/data/mishnah/ either way.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface MishnahIndexEntry {
  seder: string;
  tractateSlug: string;
  tractateHe: string;
  chapterCount: number;
}

export interface MishnahTractate {
  seder: string;
  tractateHe: string;
  chapters: string[][];
}

const CONTENT_DIR = fileURLToPath(new URL('../../../public/data/mishnah/', import.meta.url));

let indexCache: MishnahIndexEntry[] | null = null;

export function loadMishnahIndex(): MishnahIndexEntry[] {
  if (!indexCache) {
    indexCache = JSON.parse(readFileSync(`${CONTENT_DIR}index.json`, 'utf8'));
  }
  return indexCache;
}

const tractateCache = new Map<string, MishnahTractate>();

export function loadMishnahTractate(slug: string): MishnahTractate {
  if (!tractateCache.has(slug)) {
    tractateCache.set(slug, JSON.parse(readFileSync(`${CONTENT_DIR}${slug}.json`, 'utf8')));
  }
  return tractateCache.get(slug)!;
}
