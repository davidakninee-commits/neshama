// Build-time-only content loader (reads committed JSON from disk). Never
// imported by client-side code, so Node's fs is safe to use here.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface TehillimChapter {
  chapter: number;
  verses: string[];
}

export interface TehillimIndexEntry {
  chapter: number;
  verseCount: number;
}

const CONTENT_DIR = fileURLToPath(new URL('../../../data/content/tehillim/', import.meta.url));

let indexCache: TehillimIndexEntry[] | null = null;

export function loadTehillimIndex(): TehillimIndexEntry[] {
  if (!indexCache) {
    indexCache = JSON.parse(readFileSync(`${CONTENT_DIR}index.json`, 'utf8'));
  }
  return indexCache;
}

const chapterCache = new Map<number, TehillimChapter>();

export function loadTehillimChapter(chapter: number): TehillimChapter {
  if (!chapterCache.has(chapter)) {
    const fileName = String(chapter).padStart(3, '0') + '.json';
    const data = JSON.parse(readFileSync(`${CONTENT_DIR}${fileName}`, 'utf8'));
    chapterCache.set(chapter, data);
  }
  return chapterCache.get(chapter)!;
}
