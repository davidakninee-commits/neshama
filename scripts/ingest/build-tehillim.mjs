#!/usr/bin/env node
// Transforms data/raw/tehillim.json (raw Sefaria export) into compact
// per-chapter JSON files under data/content/tehillim/, committed to git.

import { readFile, writeFile, mkdir, appendFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { normalizeDeep } from './lib/normalize.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const RAW_PATH = `${ROOT}data/raw/tehillim.json`;
const OUT_DIR = `${ROOT}data/content/tehillim`;
const SOURCES_PATH = `${ROOT}data/content/SOURCES.md`;

async function main() {
  const raw = JSON.parse(await readFile(RAW_PATH, 'utf8'));
  const chapters = normalizeDeep(raw.text); // string[][], 0-indexed

  if (chapters.length !== 150) {
    console.warn(`WARNING: expected 150 Tehillim chapters, found ${chapters.length}.`);
  }

  await mkdir(OUT_DIR, { recursive: true });

  const index = [];
  for (let i = 0; i < chapters.length; i++) {
    const chapter = i + 1;
    const verses = chapters[i];
    const fileName = String(chapter).padStart(3, '0') + '.json';
    await writeFile(
      `${OUT_DIR}/${fileName}`,
      JSON.stringify({ chapter, verses }, null, 2) + '\n',
      'utf8'
    );
    index.push({ chapter, verseCount: verses.length });
  }

  await writeFile(`${OUT_DIR}/index.json`, JSON.stringify(index, null, 2) + '\n', 'utf8');

  const chapter119 = index.find((c) => c.chapter === 119);
  if (!chapter119 || chapter119.verseCount !== 176) {
    console.warn(
      `WARNING: Psalm 119 has ${chapter119?.verseCount ?? 'missing'} verses, expected 176 (22 letters x 8).`
    );
  }

  await mkdir(`${ROOT}data/content`, { recursive: true });
  await appendFile(
    SOURCES_PATH,
    `## תהילים\n\n- מקור: Sefaria-Export, versionTitle "${raw.versionTitle ?? 'Tanach with Nikkud'}"\n- רישיון: Public Domain\n- ${chapters.length} פרקים\n\n`,
    'utf8'
  );

  console.log(`Wrote ${chapters.length} chapter files + index.json to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
