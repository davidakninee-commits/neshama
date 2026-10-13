#!/usr/bin/env node
// Transforms data/raw/mishnah/*.json (raw Sefaria export, one file per
// tractate) into compact per-tractate JSON files under public/data/mishnah/,
// committed to git. Lives under public/ (not data/content/, unlike Tehillim)
// because the Mishnah-by-name feature fetches a tractate client-side at
// runtime - which tractate is needed isn't known until the visitor types a
// name - so the same files serve both build-time page generation and
// runtime fetch() from one source of truth. index.json is ordered by the
// traditional Mishnaic (ש"ס) sequence, not the bucket's alphabetical
// listing order.

import { readFile, writeFile, mkdir, appendFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { normalizeDeep } from './lib/normalize.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const MANIFEST_PATH = fileURLToPath(new URL('./manifest.json', import.meta.url));
const RAW_DIR = `${ROOT}data/raw/mishnah`;
const OUT_DIR = `${ROOT}public/data/mishnah`;
const SOURCES_PATH = `${ROOT}data/content/SOURCES.md`;

function slugify(name) {
  return name
    .replace(/^Mishnah\s+/, '')
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Traditional ש"ס order of tractates within each seder (bucket listing is
// alphabetical, which is NOT this order).
const CANONICAL_ORDER = {
  'Seder Zeraim': ['berakhot', 'peah', 'demai', 'kilayim', 'sheviit', 'terumot', 'maasrot', 'maaser-sheni', 'challah', 'orlah', 'bikkurim'],
  'Seder Moed': ['shabbat', 'eruvin', 'pesachim', 'shekalim', 'yoma', 'sukkah', 'beitzah', 'rosh-hashanah', 'taanit', 'megillah', 'moed-katan', 'chagigah'],
  'Seder Nashim': ['yevamot', 'ketubot', 'nedarim', 'nazir', 'gittin', 'sotah', 'kiddushin'],
  'Seder Nezikin': ['bava-kamma', 'bava-metzia', 'bava-batra', 'sanhedrin', 'makkot', 'shevuot', 'eduyot', 'avodah-zarah', 'pirkei-avot', 'horayot'],
  'Seder Kodashim': ['zevachim', 'menachot', 'chullin', 'bekhorot', 'arakhin', 'temurah', 'keritot', 'meilah', 'tamid', 'middot', 'kinnim'],
  'Seder Tahorot': ['kelim', 'oholot', 'negaim', 'parah', 'tahorot', 'mikvaot', 'niddah', 'makhshirin', 'zavim', 'tevul-yom', 'yadayim', 'oktzin'],
};
const SEDER_ORDER = Object.keys(CANONICAL_ORDER);

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));

  await mkdir(OUT_DIR, { recursive: true });

  const indexBySlug = new Map();
  let versionTitle = null;

  for (const entry of manifest.mishnah) {
    const slug = slugify(entry.tractate);
    const raw = JSON.parse(await readFile(`${RAW_DIR}/${slug}.json`, 'utf8'));
    versionTitle ??= raw.versionTitle ?? 'Mishnah, ed. Romm, Vilna 1913';
    const chapters = normalizeDeep(raw.text); // string[][]
    const tractateHe = raw.heTitle ?? slug;

    await writeFile(
      `${OUT_DIR}/${slug}.json`,
      JSON.stringify({ seder: entry.seder, tractateHe, chapters }, null, 2) + '\n',
      'utf8'
    );

    indexBySlug.set(slug, {
      seder: entry.seder,
      tractateSlug: slug,
      tractateHe,
      chapterCount: chapters.length,
    });
  }

  // Build index.json in canonical ש"ס order; fall back to alphabetical for
  // any slug not found in CANONICAL_ORDER (guards against a future bucket
  // reorg introducing a tractate this script doesn't know about yet).
  const index = [];
  const seen = new Set();
  for (const seder of SEDER_ORDER) {
    for (const slug of CANONICAL_ORDER[seder]) {
      const item = indexBySlug.get(slug);
      if (item) {
        index.push(item);
        seen.add(slug);
      } else {
        console.warn(`WARNING: canonical order expects "${slug}" in ${seder} but it was not ingested.`);
      }
    }
  }
  for (const [slug, item] of indexBySlug) {
    if (!seen.has(slug)) {
      console.warn(`WARNING: "${slug}" (${item.seder}) has no canonical-order entry; appending at the end.`);
      index.push(item);
    }
  }

  if (index.length !== 63) {
    console.warn(`WARNING: expected 63 tractates in index.json, got ${index.length}.`);
  }

  await writeFile(`${OUT_DIR}/index.json`, JSON.stringify(index, null, 2) + '\n', 'utf8');

  await mkdir(`${ROOT}data/content`, { recursive: true });
  await appendFile(
    SOURCES_PATH,
    `## משנה\n\n- מקור: Sefaria-Export, versionTitle "${versionTitle}"\n- רישיון: Public Domain\n- ${index.length} מסכתות, ${index.reduce((n, t) => n + t.chapterCount, 0)} פרקים\n\n`,
    'utf8'
  );

  console.log(`Wrote ${index.length} tractate files + index.json to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
