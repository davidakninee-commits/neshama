export const ALEF_BET = [
  'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל',
  'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת',
] as const;

export type HebrewLetter = (typeof ALEF_BET)[number];

/** Maps final-form letters (סופיות) to their regular form. */
export const FINAL_LETTER_MAP: Record<string, HebrewLetter> = {
  ך: 'כ',
  ם: 'מ',
  ן: 'נ',
  ף: 'פ',
  ץ: 'צ',
};

const LETTER_SET: ReadonlySet<string> = new Set(ALEF_BET);

export function isHebrewLetter(ch: string): ch is HebrewLetter {
  return LETTER_SET.has(ch);
}
