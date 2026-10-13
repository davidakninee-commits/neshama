import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mishnahForName } from './mishnahForName.ts';
import { DEFAULT_MISHNAH_LETTER_MAPPING } from './defaultMapping.ts';
import { ALEF_BET } from '../hebrew/letters.ts';

const PUBLIC_MISHNAH_DIR = fileURLToPath(new URL('../../../public/data/mishnah/', import.meta.url));

test('empty input returns no refs', () => {
  assert.deepEqual(mishnahForName(''), []);
});

test('one match per letter, in order, repeats included', () => {
  const matches = mishnahForName('דוד');
  assert.equal(matches.length, 3);
  assert.deepEqual(
    matches.map((m) => m.letter),
    ['ד', 'ו', 'ד']
  );
  assert.deepEqual(
    matches.map((m) => m.occurrenceIndex),
    [1, 2, 3]
  );
  assert.deepEqual(matches[0].ref, DEFAULT_MISHNAH_LETTER_MAPPING['ד']);
  assert.deepEqual(matches[1].ref, DEFAULT_MISHNAH_LETTER_MAPPING['ו']);
  assert.deepEqual(matches[2].ref, DEFAULT_MISHNAH_LETTER_MAPPING['ד']);
});

test('does not append anything for נשמה', () => {
  // unlike versesForName, there should be exactly one match per letter of
  // the name and nothing extra tacked on at the end
  assert.equal(mishnahForName('דוד').length, 3);
});

test('a custom mapping can be injected without touching the function', () => {
  const customRef = { tractateSlug: 'berakhot', tractateHe: 'משנה ברכות', chapter: 2, mishnah: 3 };
  const custom = { ...DEFAULT_MISHNAH_LETTER_MAPPING, ד: customRef };
  assert.deepEqual(mishnahForName('דוד', custom)[0].ref, customRef);
  assert.deepEqual(mishnahForName('דוד', custom)[2].ref, customRef);
});

test('DEFAULT_MISHNAH_LETTER_MAPPING covers all 22 letters', () => {
  for (const letter of ALEF_BET) {
    assert.ok(DEFAULT_MISHNAH_LETTER_MAPPING[letter], `missing mapping for letter ${letter}`);
  }
});

test('every placeholder entry resolves to a real mishnah in the bundled data', () => {
  const index: Array<{ tractateSlug: string; chapterCount: number }> = JSON.parse(
    readFileSync(`${PUBLIC_MISHNAH_DIR}index.json`, 'utf8')
  );
  const bySlug = new Map(index.map((t) => [t.tractateSlug, t]));

  for (const [letter, ref] of Object.entries(DEFAULT_MISHNAH_LETTER_MAPPING)) {
    const indexEntry = bySlug.get(ref.tractateSlug);
    assert.ok(indexEntry, `[${letter}] tractateSlug "${ref.tractateSlug}" not found in index.json`);
    assert.ok(
      ref.chapter >= 1 && ref.chapter <= indexEntry!.chapterCount,
      `[${letter}] chapter ${ref.chapter} out of range for "${ref.tractateSlug}" (has ${indexEntry!.chapterCount} chapters)`
    );

    const tractate: { chapters: string[][] } = JSON.parse(
      readFileSync(`${PUBLIC_MISHNAH_DIR}${ref.tractateSlug}.json`, 'utf8')
    );
    const chapterMishnayot = tractate.chapters[ref.chapter - 1];
    assert.ok(
      ref.mishnah >= 1 && ref.mishnah <= chapterMishnayot.length,
      `[${letter}] mishnah ${ref.mishnah} out of range for "${ref.tractateSlug}" ${ref.chapter} (has ${chapterMishnayot.length} mishnayot)`
    );
  }
});
