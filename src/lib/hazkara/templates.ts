import type { HazkaraTemplate, HazkaraToken } from './types.ts';

/**
 * PLACEHOLDER TEXT — NOT HALACHICALLY REVIEWED.
 *
 * Token structure (slots, gender-agreement inflection points, rite
 * separation) is final and tested; the literal liturgical Hebrew wording
 * below is a best-effort draft and MUST be checked against a printed
 * siddur/Hashkava booklet or a rabbi before real-world use at a grave —
 * regional/communal wording for all four rites varies, and this ships one
 * representative version per rite, not a survey of all of them.
 *
 * The Mizrahi and Teiman texts in particular are deliberately kept SHORTER
 * and built only from phrases that are universal across nearly all Jewish
 * traditions (Job 1:21's "ה׳ נתן וה׳ לקח", the תנצב״ה closing) rather than
 * more elaborate community-specific formulas - inventing confident-sounding
 * "authentic" wording for traditions this project has less certainty about
 * would be worse than being visibly simple and clearly flagged as a draft.
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

// Edot HaMizrach custom. Shared by both mizrahi-* templates below.
const MIZRAHI_TOKENS: HazkaraToken[] = [
  { type: 'literal', text: 'ה׳ מָלֵא רַחֲמִים, זֵכֶר ' },
  { type: 'genderWord', male: 'צַדִּיק', female: 'צַדֶּקֶת' },
  { type: 'literal', text: ' לִבְרָכָה. נֶפֶשׁ ' },
  { type: 'deceasedName' },
  { type: 'parentPhrase' },
  { type: 'literal', text: ' אֲשֶׁר ' },
  { type: 'genderWord', male: 'נִפְטַר וְהָלַךְ', female: 'נִפְטְרָה וְהָלְכָה' },
  { type: 'literal', text: ' לְ' },
  { type: 'genderWord', male: 'עוֹלָמוֹ', female: 'עוֹלָמָהּ' },
  { type: 'literal', text: '. ה׳ הוּא ' },
  { type: 'genderWord', male: 'נַחֲלָתוֹ', female: 'נַחֲלָתָהּ' },
  { type: 'literal', text: ', וּתְהִי ' },
  { type: 'genderWord', male: 'נִשְׁמָתוֹ', female: 'נִשְׁמָתָהּ' },
  { type: 'literal', text: ' צְרוּרָה בִּצְרוֹר הַחַיִּים. תנצב״ה.' },
];

// Yemenite (Teiman) custom. Shared by both teiman-* templates below.
const TEIMAN_TOKENS: HazkaraToken[] = [
  { type: 'literal', text: 'ה׳ נָתַן וַה׳ לָקָח, יְהִי שֵׁם ה׳ מְבֹרָךְ. נֶפֶשׁ ' },
  { type: 'deceasedName' },
  { type: 'parentPhrase' },
  { type: 'literal', text: ' אֲשֶׁר ' },
  { type: 'genderWord', male: 'נִפְטַר וְהָלַךְ', female: 'נִפְטְרָה וְהָלְכָה' },
  { type: 'literal', text: ' לְ' },
  { type: 'genderWord', male: 'עוֹלָמוֹ', female: 'עוֹלָמָהּ' },
  { type: 'literal', text: ', ה׳ יְנַחֵם אֶת בֵּיתוֹ, וּתְהִי ' },
  { type: 'genderWord', male: 'נִשְׁמָתוֹ', female: 'נִשְׁמָתָהּ' },
  { type: 'literal', text: ' צְרוּרָה בִּצְרוֹר הַחַיִּים. תנצב״ה.' },
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
  'mizrahi-male': {
    rite: 'mizrahi',
    gender: 'male',
    title: 'הזכרה (עדות המזרח) — לאיש',
    tokens: MIZRAHI_TOKENS,
  },
  'mizrahi-female': {
    rite: 'mizrahi',
    gender: 'female',
    title: 'הזכרה (עדות המזרח) — לאישה',
    tokens: MIZRAHI_TOKENS,
  },
  'teiman-male': {
    rite: 'teiman',
    gender: 'male',
    title: 'הזכרה (נוסח תימן) — לאיש',
    tokens: TEIMAN_TOKENS,
  },
  'teiman-female': {
    rite: 'teiman',
    gender: 'female',
    title: 'הזכרה (נוסח תימן) — לאישה',
    tokens: TEIMAN_TOKENS,
  },
};
