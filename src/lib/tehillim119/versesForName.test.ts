import { test } from 'node:test';
import assert from 'node:assert/strict';
import { versesForName } from './versesForName.ts';

const NESHAMA_STANZAS = [
  { startVerse: 105, endVerse: 112, letter: 'נ', source: 'neshama' },
  { startVerse: 161, endVerse: 168, letter: 'ש', source: 'neshama' },
  { startVerse: 97, endVerse: 104, letter: 'מ', source: 'neshama' },
  { startVerse: 33, endVerse: 40, letter: 'ה', source: 'neshama' },
];

test('empty input returns no stanzas', () => {
  assert.deepEqual(versesForName(''), []);
});

test('non-Hebrew-only input returns no stanzas', () => {
  assert.deepEqual(versesForName('David 123'), []);
});

test('"דוד" -> ד, ו, ד (repeated) + נשמה, 7 stanzas / 56 verses', () => {
  const result = versesForName('דוד');
  assert.equal(result.length, 7);
  const totalVerses = result.reduce((n, r) => n + (r.endVerse - r.startVerse + 1), 0);
  assert.equal(totalVerses, 56);

  assert.deepEqual(
    result.map(({ letter, startVerse, endVerse, source }) => ({ letter, startVerse, endVerse, source })),
    [
      { letter: 'ד', startVerse: 25, endVerse: 32, source: 'name' },
      { letter: 'ו', startVerse: 41, endVerse: 48, source: 'name' },
      { letter: 'ד', startVerse: 25, endVerse: 32, source: 'name' },
      ...NESHAMA_STANZAS,
    ]
  );

  // repeated letter produces two distinct VerseRanges, not deduplicated
  assert.equal(result.filter((r) => r.letter === 'ד').length, 2);
  // occurrenceIndex increments monotonically across the whole sequence
  assert.deepEqual(result.map((r) => r.occurrenceIndex), [1, 2, 3, 4, 5, 6, 7]);
});

test('final letters are mapped to their regular form before lookup', () => {
  // אפרים ends with ם (final mem) -> should resolve to the מ stanza (97-104)
  const result = versesForName('אפרים');
  const nameStanzas = result.filter((r) => r.source === 'name');
  assert.deepEqual(
    nameStanzas.map((r) => r.letter),
    ['א', 'פ', 'ר', 'י', 'מ']
  );
  assert.deepEqual(nameStanzas.at(-1), {
    letter: 'מ',
    startVerse: 97,
    endVerse: 104,
    source: 'name',
    occurrenceIndex: 5,
  });
});

test('nikud in the input does not change the result', () => {
  assert.deepEqual(versesForName('דָּוִד'), versesForName('דוד'));
});

test('a typed בן/בת parent-name suffix is dropped before lookup', () => {
  assert.deepEqual(versesForName('דוד בן אברהם'), versesForName('דוד'));
  assert.deepEqual(versesForName('רחל בת שרה'), versesForName('רחל'));
});

test('every stanza is exactly 8 verses (176 / 22 letters)', () => {
  for (const r of versesForName('משה')) {
    assert.equal(r.endVerse - r.startVerse + 1, 8);
  }
});
