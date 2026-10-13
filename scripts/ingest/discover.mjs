#!/usr/bin/env node
// Walks the public Sefaria-Export GCS bucket and regenerates manifest.json.
// This is a MANUAL/occasional command — normal `npm run ingest` runs against
// the already-committed manifest.json rather than re-discovering paths every
// time. Re-run this only if Sefaria reorganizes the bucket layout.

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { listPrefixes, getObjectMeta } from './lib/gcs.mjs';

const MANIFEST_PATH = fileURLToPath(new URL('./manifest.json', import.meta.url));

const TEHILLIM_OBJECT = 'json/Tanakh/Writings/Psalms/Hebrew/Tanach with Nikkud.json';

const SEDARIM = [
  'Seder Zeraim',
  'Seder Moed',
  'Seder Nashim',
  'Seder Nezikin',
  'Seder Kodashim',
  'Seder Tahorot',
];

const ROMM_VILNA_FILENAME = 'Mishnah, ed. Romm, Vilna 1913.json';

async function discoverMishnah() {
  const entries = [];
  for (const seder of SEDARIM) {
    const prefix = `json/Mishnah/${seder}/`;
    const tractates = await listPrefixes(prefix);
    for (const tractate of tractates) {
      const object = `${prefix}${tractate}/Hebrew/${ROMM_VILNA_FILENAME}`;
      const meta = await getObjectMeta(object);
      entries.push({ seder, tractate, object, size: Number(meta.size) });
    }
  }
  return entries;
}

async function main() {
  console.log('Discovering Tehillim object...');
  const tehillimMeta = await getObjectMeta(TEHILLIM_OBJECT);

  console.log('Discovering Mishnah objects (63 tractates across 6 sedarim)...');
  const mishnah = await discoverMishnah();

  const manifest = {
    tehillim: {
      object: TEHILLIM_OBJECT,
      size: Number(tehillimMeta.size),
      license: 'Public Domain',
      versionTitle: 'Tanach with Nikkud',
    },
    mishnah,
  };

  if (mishnah.length !== 63) {
    console.warn(`WARNING: expected 63 Mishnah tractates, found ${mishnah.length}. Review before trusting this manifest.`);
  }

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${MANIFEST_PATH} (${mishnah.length} mishnah entries).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
