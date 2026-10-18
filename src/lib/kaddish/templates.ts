import type { KaddishTemplate, Rite } from './types.ts';

/**
 * PLACEHOLDER TEXT — NOT HALACHICALLY REVIEWED.
 *
 * The core Kaddish text is ~95% identical across all traditions (it is one
 * of the most fixed, universally-printed Jewish prayers), so unlike
 * Hazkara's four genuinely distinct texts, this module applies two
 * specific, well-documented wording differences between Ashkenaz and
 * Sephard/Edot HaMizrach, then reuses the Sephardi form as-is for both
 * Mizrahi and Teiman rather than inventing community-specific wording this
 * project has no confident source for (Yemenite Kaddish in particular
 * differs significantly in PRONUNCIATION, which written text can't capture
 * anyway). This MUST be checked against a printed siddur or a rabbi before
 * real-world use - see the two flagged differences below for exactly what
 * was varied and why.
 */
export const isPlaceholder = true;

const ASHKENAZI_LINES = [
  {
    text: 'יִתְגַּדַּל וְיִתְקַדַּשׁ שְׁמֵהּ רַבָּא, בְּעָלְמָא דִּי בְרָא כִרְעוּתֵהּ, וְיַמְלִיךְ מַלְכוּתֵהּ, וְיַצְמַח פֻּרְקָנֵהּ וִיקָרֵב מְשִׁיחֵהּ, בְּחַיֵּיכוֹן וּבְיוֹמֵיכוֹן וּבְחַיֵּי דְכָל בֵּית יִשְׂרָאֵל, בַּעֲגָלָא וּבִזְמַן קָרִיב, וְאִמְרוּ אָמֵן.',
  },
  {
    text: 'אָמֵן. יְהֵא שְׁמֵהּ רַבָּא מְבָרַךְ לְעָלַם וּלְעָלְמֵי עָלְמַיָּא.',
    isResponse: true,
  },
  {
    // Ashkenaz-specific: doubled "לְעֵלָּא לְעֵלָּא" - the Sephardi/Edot form says it once.
    text: 'יִתְבָּרַךְ וְיִשְׁתַּבַּח וְיִתְפָּאַר וְיִתְרוֹמַם וְיִתְנַשֵּׂא וְיִתְהַדָּר וְיִתְעַלֶּה וְיִתְהַלָּל שְׁמֵהּ דְּקֻדְשָׁא בְּרִיךְ הוּא, לְעֵלָּא לְעֵלָּא מִכָּל בִּרְכָתָא וְשִׁירָתָא תֻּשְׁבְּחָתָא וְנֶחָמָתָא דַּאֲמִירָן בְּעָלְמָא, וְאִמְרוּ אָמֵן.',
  },
  {
    text: 'יְהֵא שְׁלָמָא רַבָּא מִן שְׁמַיָּא וְחַיִּים עָלֵינוּ וְעַל כָּל יִשְׂרָאֵל, וְאִמְרוּ אָמֵן.',
  },
  {
    text: 'עֹשֶׂה שָׁלוֹם בִּמְרוֹמָיו הוּא יַעֲשֶׂה שָׁלוֹם עָלֵינוּ וְעַל כָּל יִשְׂרָאֵל, וְאִמְרוּ אָמֵן.',
  },
];

const SEPHARDI_LINES = [
  ASHKENAZI_LINES[0],
  ASHKENAZI_LINES[1],
  {
    // Sephardi/Edot HaMizrach form: single "לְעֵלָּא מִכָּל" (not doubled).
    text: 'יִתְבָּרַךְ וְיִשְׁתַּבַּח וְיִתְפָּאַר וְיִתְרוֹמַם וְיִתְנַשֵּׂא וְיִתְהַדָּר וְיִתְעַלֶּה וְיִתְהַלָּל שְׁמֵהּ דְּקֻדְשָׁא בְּרִיךְ הוּא, לְעֵלָּא מִכָּל בִּרְכָתָא וְשִׁירָתָא תֻּשְׁבְּחָתָא וְנֶחָמָתָא דַּאֲמִירָן בְּעָלְמָא, וְאִמְרוּ אָמֵן.',
  },
  ASHKENAZI_LINES[3],
  {
    // Sephardi/Edot HaMizrach ending: "ברחמיו... ועל כל עמו ישראל" (not "במרומיו הוא יעשה... ועל כל ישראל").
    text: 'עֹשֶׂה שָׁלוֹם בִּמְרוֹמָיו הוּא בְּרַחֲמָיו יַעֲשֶׂה שָׁלוֹם עָלֵינוּ וְעַל כָּל עַמּוֹ יִשְׂרָאֵל, וְאִמְרוּ אָמֵן.',
  },
];

export const KADDISH_TEMPLATES: Record<Rite, KaddishTemplate> = {
  ashkenazi: { rite: 'ashkenazi', title: 'קדיש יתום (נוסח אשכנז)', lines: ASHKENAZI_LINES },
  sephardi: { rite: 'sephardi', title: 'קדיש יתום (נוסח ספרד)', lines: SEPHARDI_LINES },
  // Reusing the Sephardi/Edot HaMizrach form as-is - see module comment above.
  mizrahi: { rite: 'mizrahi', title: 'קדיש יתום (עדות המזרח)', lines: SEPHARDI_LINES },
  teiman: { rite: 'teiman', title: 'קדיש יתום (נוסח תימן)', lines: SEPHARDI_LINES },
};
