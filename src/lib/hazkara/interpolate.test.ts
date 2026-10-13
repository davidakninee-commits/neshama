import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderHazkara } from './interpolate.ts';
import { HAZKARA_TEMPLATES } from './templates.ts';

test('all 4 variants render non-empty text containing the deceased name', () => {
  for (const key of Object.keys(HAZKARA_TEMPLATES) as Array<keyof typeof HAZKARA_TEMPLATES>) {
    const text = renderHazkara(HAZKARA_TEMPLATES[key], { deceasedName: 'דוד' });
    assert.ok(text.length > 0, `${key} rendered empty`);
    assert.ok(text.includes('דוד'), `${key} missing the deceased's name`);
  }
});

test('ashkenazi-male: exact text with a parent name', () => {
  const text = renderHazkara(HAZKARA_TEMPLATES['ashkenazi-male'], {
    deceasedName: 'דוד',
    parentName: 'אברהם',
    parentRelation: 'father',
  });
  assert.equal(
    text,
    'אֵל מָלֵא רַחֲמִים שׁוֹכֵן בַּמְּרוֹמִים, הַמְצֵא מְנוּחָה נְכוֹנָה תַּחַת כַּנְפֵי הַשְּׁכִינָה, ' +
      'בְּמַעֲלוֹת קְדוֹשִׁים וּטְהוֹרִים כְּזֹהַר הָרָקִיעַ מַזְהִירִים, אֶת נִשְׁמַת דוד בן אברהם שֶׁהָלַךְ ' +
      'לְעוֹלָמוֹ, בְּגַן עֵדֶן תְּהֵא מְנוּחָתוֹ. לָכֵן בַּעַל הָרַחֲמִים יַסְתִּירֵהוּ בְּסֵתֶר כְּנָפָיו לְעוֹלָמִים, ' +
      'וְיִצְרוֹר בִּצְרוֹר הַחַיִּים אֶת נִשְׁמָתוֹ, ה׳ הוּא נַחֲלָתוֹ, וְיָנוּחַ בְּשָׁלוֹם עַל מִשְׁכָּבוֹ, וְנֹאמַר אָמֵן.'
  );
});

test('ashkenazi-female uses female inflections throughout, same scaffolding', () => {
  const text = renderHazkara(HAZKARA_TEMPLATES['ashkenazi-female'], { deceasedName: 'רחל' });
  for (const word of ['הָלְכָה', 'לְעוֹלָמָהּ', 'מְנוּחָתָהּ', 'יַסְתִּירֶהָ', 'נִשְׁמָתָהּ', 'נַחֲלָתָהּ', 'תָנוּחַ', 'מִשְׁכָּבָהּ']) {
    assert.ok(text.includes(word), `expected female inflection "${word}" in: ${text}`);
  }
  // none of the male forms should leak in
  for (const word of ['הָלַךְ', 'לְעוֹלָמוֹ', 'מְנוּחָתוֹ', 'יַסְתִּירֵהוּ']) {
    assert.ok(!text.includes(word), `unexpected male inflection "${word}" in: ${text}`);
  }
});

test('parentPhrase: בן for a male template, בת for a female template, regardless of parentRelation', () => {
  const maleText = renderHazkara(HAZKARA_TEMPLATES['ashkenazi-male'], {
    deceasedName: 'דוד',
    parentName: 'שרה',
    parentRelation: 'mother',
  });
  assert.ok(maleText.includes('דוד בן שרה'), 'expected "בן" (son of) regardless of which parent was named');

  const femaleText = renderHazkara(HAZKARA_TEMPLATES['ashkenazi-female'], {
    deceasedName: 'רחל',
    parentName: 'אברהם',
    parentRelation: 'father',
  });
  assert.ok(femaleText.includes('רחל בת אברהם'), 'expected "בת" (daughter of) for a female template');
});

test('parentPhrase is omitted entirely when no parent name is given', () => {
  const text = renderHazkara(HAZKARA_TEMPLATES['ashkenazi-male'], { deceasedName: 'דוד' });
  assert.ok(!text.includes(' בן '), 'should not render a dangling "בן" with no parent name');
  assert.ok(text.includes('נִשְׁמַת דוד שֶׁ'), 'name should flow directly into the next clause');
});

test('sephardi and ashkenazi templates use genuinely different wording', () => {
  const ashkenazi = renderHazkara(HAZKARA_TEMPLATES['ashkenazi-male'], { deceasedName: 'דוד' });
  const sephardi = renderHazkara(HAZKARA_TEMPLATES['sephardi-male'], { deceasedName: 'דוד' });
  assert.notEqual(ashkenazi, sephardi);
  assert.ok(ashkenazi.startsWith('אֵל מָלֵא רַחֲמִים'));
  assert.ok(sephardi.startsWith('מְנוּחָה נְכוֹנָה בִּישִׁיבָה'));
});

test('isPlaceholder flag is exported and true (drives the UI disclaimer)', async () => {
  const { isPlaceholder } = await import('./templates.ts');
  assert.equal(isPlaceholder, true);
});
