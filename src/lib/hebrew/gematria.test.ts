import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toHebrewNumeral } from './gematria.ts';

test('single digits get a trailing geresh', () => {
  assert.equal(toHebrewNumeral(1), 'א׳');
  assert.equal(toHebrewNumeral(9), 'ט׳');
});

test('round tens/hundreds get a trailing geresh (still one letter)', () => {
  assert.equal(toHebrewNumeral(10), 'י׳');
  assert.equal(toHebrewNumeral(20), 'כ׳');
  assert.equal(toHebrewNumeral(100), 'ק׳');
  assert.equal(toHebrewNumeral(400), 'ת׳');
});

test('ordinary two-letter combinations get gershayim before the last letter', () => {
  assert.equal(toHebrewNumeral(11), 'י״א');
  assert.equal(toHebrewNumeral(12), 'י״ב');
  assert.equal(toHebrewNumeral(19), 'י״ט');
  assert.equal(toHebrewNumeral(21), 'כ״א');
  assert.equal(toHebrewNumeral(99), 'צ״ט');
});

test('15 and 16 use the ט״ו / ט״ז exception, never the Tetragrammaton-adjacent forms', () => {
  assert.equal(toHebrewNumeral(15), 'ט״ו');
  assert.equal(toHebrewNumeral(16), 'ט״ז');
  // sanity: the forbidden forms never appear anywhere in the output
  assert.notEqual(toHebrewNumeral(15), 'י״ה');
  assert.notEqual(toHebrewNumeral(16), 'י״ו');
});

test('the 15/16 exception also applies inside larger numbers (e.g. 115, 116)', () => {
  assert.equal(toHebrewNumeral(115), 'קט״ו');
  assert.equal(toHebrewNumeral(116), 'קט״ז');
});

test('Psalm 119 renders as the traditional קי״ט', () => {
  assert.equal(toHebrewNumeral(119), 'קי״ט');
});

test('Psalm 150 (the last chapter) renders as ק״נ', () => {
  assert.equal(toHebrewNumeral(150), 'ק״נ');
});

test('three-letter combinations place gershayim before only the final letter', () => {
  assert.equal(toHebrewNumeral(123), 'קכ״ג');
  assert.equal(toHebrewNumeral(345), 'שמ״ה');
});

test('hundreds above 400 repeat ת', () => {
  assert.equal(toHebrewNumeral(500), 'ת״ק');
  assert.equal(toHebrewNumeral(800), 'ת״ת');
  assert.equal(toHebrewNumeral(900), 'תת״ק');
});

test('every chapter number from 1 to 176 (max needed: Psalm 119 has 176 verses) produces a non-empty, correctly-punctuated result', () => {
  for (let n = 1; n <= 176; n++) {
    const result = toHebrewNumeral(n);
    assert.ok(result.length >= 2, `${n} -> "${result}" is too short to be punctuated`);
    assert.ok(result.includes('׳') || result.includes('״'), `${n} -> "${result}" missing geresh/gershayim`);
  }
});

test('throws on non-positive or non-integer input', () => {
  assert.throws(() => toHebrewNumeral(0));
  assert.throws(() => toHebrewNumeral(-5));
  assert.throws(() => toHebrewNumeral(1.5));
});
