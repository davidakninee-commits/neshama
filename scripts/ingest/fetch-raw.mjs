#!/usr/bin/env node
// Downloads the objects listed in the committed manifest.json into data/raw/
// (gitignored scratch space). Verifies each download's byte length against
// the manifest's recorded size as a basic integrity check.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { downloadObjectText } from './lib/gcs.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const MANIFEST_PATH = fileURLToPath(new URL('./manifest.json', import.meta.url));
const RAW_DIR = `${ROOT}data/raw`;

function slugify(name) {
  return name
    .replace(/^Mishnah\s+/, '')
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function fetchAndVerify(label, object, expectedSize, destPath) {
  const text = await downloadObjectText(object);
  const actualSize = Buffer.byteLength(text, 'utf8');
  if (actualSize !== expectedSize) {
    console.warn(
      `WARNING: ${label} size mismatch — manifest says ${expectedSize} bytes, downloaded ${actualSize} bytes.`
    );
  }
  await writeFile(destPath, text, 'utf8');
  console.log(`  ${label} -> ${destPath} (${actualSize} bytes)`);
}

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));

  await mkdir(RAW_DIR, { recursive: true });
  await mkdir(`${RAW_DIR}/mishnah`, { recursive: true });

  console.log('Fetching Tehillim...');
  await fetchAndVerify(
    'Tehillim',
    manifest.tehillim.object,
    manifest.tehillim.size,
    `${RAW_DIR}/tehillim.json`
  );

  console.log(`Fetching ${manifest.mishnah.length} Mishnah tractates...`);
  for (const entry of manifest.mishnah) {
    const slug = slugify(entry.tractate);
    await fetchAndVerify(
      entry.tractate,
      entry.object,
      entry.size,
      `${RAW_DIR}/mishnah/${slug}.json`
    );
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
