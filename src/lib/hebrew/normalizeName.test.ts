import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeName, extractHebrewLetters } from './normalizeName.ts';

test('plain name passes through', () => {
  const { lettersOnly, display } = normalizeName('דוד');
  assert.equal(display, 'דוד');
  assert.equal(lettersOnly, 'דוד');
});

test('strips nikud', () => {
  const { lettersOnly, display } = normalizeName('דָּוִד');
  assert.equal(lettersOnly, 'דוד');
  assert.equal(display, 'דוד');
});

test('maps final letters to regular form for lettersOnly', () => {
  const { lettersOnly, display } = normalizeName('אפרים');
  // אפרים ends in ם (final mem) — lettersOnly should map it to מ
  assert.equal(lettersOnly, 'אפרימ');
  // display keeps the final form as typed
  assert.equal(display, 'אפרים');
});

test('drops a trailing בן X parent-name suffix', () => {
  const { lettersOnly, display } = normalizeName('דוד בן אברהם');
  assert.equal(display, 'דוד');
  assert.equal(lettersOnly, 'דוד');
});

test('drops a trailing בת X parent-name suffix', () => {
  const { display } = normalizeName('רחל בת שרה');
  assert.equal(display, 'רחל');
});

test('empty input', () => {
  const { lettersOnly, display } = normalizeName('');
  assert.equal(lettersOnly, '');
  assert.equal(display, '');
});

test('filters out non-Hebrew characters from lettersOnly', () => {
  const { lettersOnly } = normalizeName('David דוד 123');
  assert.equal(lettersOnly, 'דוד');
});

test('extractHebrewLetters returns an array matching lettersOnly', () => {
  assert.deepEqual(extractHebrewLetters('דוד'), ['ד', 'ו', 'ד']);
});

test('extractHebrewLetters maps final letters', () => {
  assert.deepEqual(extractHebrewLetters('אפרים'), ['א', 'פ', 'ר', 'י', 'מ']);
});
