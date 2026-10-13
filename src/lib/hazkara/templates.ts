import type { HazkaraTemplate, HazkaraToken } from './types.ts';

/**
 * PLACEHOLDER TEXT — NOT HALACHICALLY REVIEWED.
 *
 * Token structure (slots, gender-agreement inflection points, rite
 * separation) is final and tested; the literal liturgical Hebrew wording
 * below is a best-effort draft and MUST be checked against a printed
 * siddur/Hashkava booklet or a rabbi before real-world use at a grave —
 * regional/communal wording for both אל מלא רחמים and השכבה varies, and
 * this ships one representative version per rite, not a survey of all of
 * them.
 */
export const isPlaceholder = true;

// Ashkenazi custom: "אל מלא רחמים". Shared by both ashkenazi-* templates
// below — only `gender` differs between them, which is what makes every
// `genderWord` token here resolve differently.
const ASHKENAZI_TOKENS: HazkaraToken[] = [
  {
    type: 'literal',
    text: 'אֵל מָלֵא רַחֲמִים שׁוֹכֵן בַּמְּרוֹמִים, הַמְצֵא מְנוּחָה נְכוֹנָה תַּחַת כַּנְפֵי הַשְּׁכִינָה, בְּמַעֲלוֹת קְדוֹשִׁים וּטְהוֹרִים כְּזֹהַר הָרָקִיעַ מַזְהִירִים, אֶת נִשְׁמַת ',
  },
  { type: 'deceasedName' },
  { type: 'parentPhrase' },
  { type: 'literal', text: ' שֶׁ' },
  { type: 'genderWord', male: 'הָלַךְ', female: 'הָלְכָה' },
  { type: 'literal', text: ' לְ' },
  { type: 'genderWord', male: 'עוֹלָמוֹ', female: 'עוֹלָמָהּ' },
  { type: 'literal', text: ', בְּגַן עֵדֶן תְּהֵא ' },
  { type: 'genderWord', male: 'מְנוּחָתוֹ', female: 'מְנוּחָתָהּ' },
  { type: 'literal', text: '. לָכֵן בַּעַל הָרַחֲמִים ' },
  { type: 'genderWord', male: 'יַסְתִּירֵהוּ', female: 'יַסְתִּירֶהָ' },
  { type: 'literal', text: ' בְּסֵתֶר כְּנָפָיו לְעוֹלָמִים, וְיִצְרוֹר בִּצְרוֹר הַחַיִּים אֶת ' },
  { type: 'genderWord', male: 'נִשְׁמָתוֹ', female: 'נִשְׁמָתָהּ' },
  { type: 'literal', text: ', ה׳ הוּא ' },
  { type: 'genderWord', male: 'נַחֲלָתוֹ', female: 'נַחֲלָתָהּ' },
  { type: 'literal', text: ', וְ' },
  { type: 'genderWord', male: 'יָנוּחַ', female: 'תָנוּחַ' },
  { type: 'literal', text: ' בְּשָׁלוֹם עַל ' },
  { type: 'genderWord', male: 'מִשְׁכָּבוֹ', female: 'מִשְׁכָּבָהּ' },
  { type: 'literal', text: ', וְנֹאמַר אָמֵן.' },
];

// Sephardi custom: "השכבה". Shared by both sephardi-* templates below.
const SEPHARDI_TOKENS: HazkaraToken[] = [
  { type: 'literal', text: 'מְנוּחָה נְכוֹנָה בִּישִׁיבָה שֶׁל מַעְלָה, בְּגַן עֵדֶן תְּהֵא ' },
  { type: 'genderWord', male: 'מְנוּחָתוֹ', female: 'מְנוּחָתָהּ' },
  { type: 'literal', text: ', בְּמַעֲלַת קְדוֹשִׁים וּטְהוֹרִים כְּזֹהַר הָרָקִיעַ מַזְהִירִים, לְנֶפֶשׁ ' },
  { type: 'deceasedName' },
  { type: 'parentPhrase' },
  { type: 'literal', text: ' שֶׁ' },
  { type: 'genderWord', male: 'הָלַךְ', female: 'הָלְכָה' },
  { type: 'literal', text: ' לְ' },
  { type: 'genderWord', male: 'עוֹלָמוֹ', female: 'עוֹלָמָהּ' },
  { type: 'literal', text: '. עַל כֵּן בַּעַל הָרַחֲמִים ' },
  { type: 'genderWord', male: 'יַסְתִּירֵהוּ', female: 'יַסְתִּירֶהָ' },
  { type: 'literal', text: ' בְּסֵתֶר כְּנָפָיו לְעוֹלָמִים, וְתִהְיֶה ' },
  { type: 'genderWord', male: 'נַפְשׁוֹ', female: 'נַפְשָׁהּ' },
  { type: 'literal', text: ' צְרוּרָה בִּצְרוֹר הַחַיִּים, ה׳ הוּא ' },
  { type: 'genderWord', male: 'נַחֲלָתוֹ', female: 'נַחֲלָתָהּ' },
  { type: 'literal', text: ', אָמֵן.' },
];

export const HAZKARA_TEMPLATES: Record<`${HazkaraTemplate['rite']}-${HazkaraTemplate['gender']}`, HazkaraTemplate> = {
  'ashkenazi-male': {
    rite: 'ashkenazi',
    gender: 'male',
    title: 'אל מלא רחמים (נוסח אשכנז) — לאיש',
    tokens: ASHKENAZI_TOKENS,
  },
  'ashkenazi-female': {
    rite: 'ashkenazi',
    gender: 'female',
    title: 'אל מלא רחמים (נוסח אשכנז) — לאישה',
    tokens: ASHKENAZI_TOKENS,
  },
  'sephardi-male': {
    rite: 'sephardi',
    gender: 'male',
    title: 'השכבה (נוסח ספרד) — לאיש',
    tokens: SEPHARDI_TOKENS,
  },
  'sephardi-female': {
    rite: 'sephardi',
    gender: 'female',
    title: 'השכבה (נוסח ספרד) — לאישה',
    tokens: SEPHARDI_TOKENS,
  },
};
