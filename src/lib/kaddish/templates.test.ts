import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KADDISH_TEMPLATES, isPlaceholder } from './templates.ts';

test('all 4 rites are present with non-empty lines', () => {
  const rites = ['ashkenazi', 'sephardi', 'mizrahi', 'teiman'] as const;
  for (const rite of rites) {
    const template = KADDISH_TEMPLATES[rite];
    assert.ok(template, `missing template for ${rite}`);
    assert.equal(template.rite, rite);
    assert.ok(template.lines.length > 0, `${rite} has no lines`);
    for (const line of template.lines) {
      assert.ok(line.text.length > 0, `${rite} has an empty line`);
    }
  }
});

test('exactly one line per rite is the congregational response', () => {
  for (const template of Object.values(KADDISH_TEMPLATES)) {
    const responses = template.lines.filter((l) => l.isResponse);
    assert.equal(responses.length, 1, `${template.rite} should have exactly one response line`);
    assert.ok(responses[0].text.includes('יְהֵא שְׁמֵהּ רַבָּא'));
  }
});

test('Ashkenazi doubles "לעלא", Sephardi/Mizrahi/Teiman say it once', () => {
  const ashkenaziThirdLine = KADDISH_TEMPLATES.ashkenazi.lines[2].text;
  assert.ok(ashkenaziThirdLine.includes('לְעֵלָּא לְעֵלָּא'));

  for (const rite of ['sephardi', 'mizrahi', 'teiman'] as const) {
    const thirdLine = KADDISH_TEMPLATES[rite].lines[2].text;
    assert.ok(!thirdLine.includes('לְעֵלָּא לְעֵלָּא'), `${rite} should not have the doubled form`);
    assert.ok(thirdLine.includes('לְעֵלָּא מִכָּל'));
  }
});

test('mizrahi and teiman currently reuse the sephardi text verbatim (documented, not a bug)', () => {
  assert.deepEqual(KADDISH_TEMPLATES.mizrahi.lines, KADDISH_TEMPLATES.sephardi.lines);
  assert.deepEqual(KADDISH_TEMPLATES.teiman.lines, KADDISH_TEMPLATES.sephardi.lines);
});

test('every template title mentions קדיש', () => {
  for (const template of Object.values(KADDISH_TEMPLATES)) {
    assert.ok(template.title.includes('קדיש'));
  }
});

test('isPlaceholder flag is exported and true', () => {
  assert.equal(isPlaceholder, true);
});
