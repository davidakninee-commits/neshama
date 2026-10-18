import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderHazkara } from './interpolate.ts';
import { HAZKARA_TEMPLATES, HAZKARA_GRAVE_VISIT_TEMPLATES } from './templates.ts';

test('all 8 variants (4 rites x 2 genders) render non-empty text containing the deceased name', () => {
  const keys = Object.keys(HAZKARA_TEMPLATES) as Array<keyof typeof HAZKARA_TEMPLATES>;
  assert.equal(keys.length, 8);
  for (const key of keys) {
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

test('all 4 rites use genuinely different wording from each other', () => {
  const rites = ['ashkenazi', 'sephardi', 'mizrahi', 'teiman'] as const;
  const texts = rites.map((rite) => renderHazkara(HAZKARA_TEMPLATES[`${rite}-male`], { deceasedName: 'דוד' }));
  const unique = new Set(texts);
  assert.equal(unique.size, rites.length, 'expected 4 distinct texts, found duplicates');

  assert.ok(texts[0].startsWith('אֵל מָלֵא רַחֲמִים'));
  assert.ok(texts[1].startsWith('מְנוּחָה נְכוֹנָה בִּישִׁיבָה'));
  assert.ok(texts[2].startsWith('ה׳ מָלֵא רַחֲמִים'));
  assert.ok(texts[3].startsWith('ה׳ נָתַן וַה׳ לָקָח'));
});

test('mizrahi and teiman: female inflections apply correctly and both close with תנצב״ה', () => {
  for (const rite of ['mizrahi', 'teiman'] as const) {
    const male = renderHazkara(HAZKARA_TEMPLATES[`${rite}-male`], { deceasedName: 'דוד' });
    const female = renderHazkara(HAZKARA_TEMPLATES[`${rite}-female`], { deceasedName: 'רחל' });
    assert.ok(male.includes('נִפְטַר וְהָלַךְ'), `${rite}-male missing male inflection`);
    assert.ok(female.includes('נִפְטְרָה וְהָלְכָה'), `${rite}-female missing female inflection`);
    assert.ok(male.endsWith('תנצב״ה.'), `${rite}-male should close with תנצב״ה`);
    assert.ok(female.endsWith('תנצב״ה.'), `${rite}-female should close with תנצב״ה`);
  }
});

test('isPlaceholder flag is exported and true (drives the UI disclaimer)', async () => {
  const { isPlaceholder } = await import('./templates.ts');
  assert.equal(isPlaceholder, true);
});

test('grave-visit templates: all 8 variants render non-empty text containing the deceased name and the grave-visit opening', () => {
  const keys = Object.keys(HAZKARA_GRAVE_VISIT_TEMPLATES) as Array<keyof typeof HAZKARA_GRAVE_VISIT_TEMPLATES>;
  assert.equal(keys.length, 8);
  for (const key of keys) {
    const text = renderHazkara(HAZKARA_GRAVE_VISIT_TEMPLATES[key], { deceasedName: 'דוד' });
    assert.ok(text.includes('דוד'), `${key} missing the deceased's name`);
    assert.ok(text.startsWith('בְּעָמְדִי הַיּוֹם עַל מְקוֹם'), `${key} missing the grave-visit opening`);
  }
});

test('grave-visit opening inflects by gender and is followed by the same burial-day core text', () => {
  const graveMale = renderHazkara(HAZKARA_GRAVE_VISIT_TEMPLATES['ashkenazi-male'], { deceasedName: 'דוד' });
  const graveFemale = renderHazkara(HAZKARA_GRAVE_VISIT_TEMPLATES['ashkenazi-female'], { deceasedName: 'רחל' });
  assert.ok(graveMale.includes('מְקוֹם מְנוּחָתוֹ,'));
  assert.ok(graveFemale.includes('מְקוֹם מְנוּחָתָהּ,'));

  const burialMale = renderHazkara(HAZKARA_TEMPLATES['ashkenazi-male'], { deceasedName: 'דוד' });
  assert.ok(graveMale.endsWith(burialMale), 'grave-visit text should end with the exact burial-day text');
});

test('grave-visit templates carry occasion "graveVisit", burial templates carry "burial"', () => {
  for (const template of Object.values(HAZKARA_GRAVE_VISIT_TEMPLATES)) {
    assert.equal(template.occasion, 'graveVisit');
  }
  for (const template of Object.values(HAZKARA_TEMPLATES)) {
    assert.equal(template.occasion, 'burial');
  }
});
