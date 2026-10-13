import { ALEF_BET, type HebrewLetter } from '../hebrew/letters.ts';

export interface VerseRange {
  /** 1-indexed verse number within Psalm 119, start of this stanza */
  startVerse: number;
  /** 1-indexed verse number within Psalm 119, end of this stanza (inclusive) */
  endVerse: number;
  /** the Hebrew letter this stanza corresponds to */
  letter: HebrewLetter;
  /** whether this stanza came from a letter in the name, or from the trailing נ-ש-מ-ה */
  source: 'name' | 'neshama';
  /** 1-based position among all returned stanzas (distinguishes repeated letters) */
  occurrenceIndex: number;
}

/** Each of the 22 letters covers 8 consecutive verses: א=1-8, ב=9-16, ... ת=169-176. */
export const LETTER_STANZA_MAP: Record<HebrewLetter, [number, number]> = Object.fromEntries(
  ALEF_BET.map((letter, i) => [letter, [i * 8 + 1, i * 8 + 8]])
) as Record<HebrewLetter, [number, number]>;

/** נ-ש-מ-ה closing stanzas, appended after the name's own letters, in this fixed order. */
export const NESHAMA_LETTERS = ['נ', 'ש', 'מ', 'ה'] as const satisfies readonly HebrewLetter[];
