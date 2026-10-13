import { extractHebrewLetters } from '../hebrew/normalizeName.ts';
import { DEFAULT_MISHNAH_LETTER_MAPPING } from './defaultMapping.ts';
import type { MishnahLetterMapping, MishnahMatch } from './types.ts';

/**
 * Given a raw Hebrew name, returns the Mishnayot to learn: one per letter of
 * the name (in order, repeats included — not deduplicated). Unlike
 * versesForName, does NOT append anything for נ-ש-מ-ה — no established
 * custom for that was found for Mishnah study. Accepts an injectable mapping
 * so a reviewed table can be swapped in later without touching this
 * function's logic.
 */
export function mishnahForName(
  name: string,
  mapping: MishnahLetterMapping = DEFAULT_MISHNAH_LETTER_MAPPING
): MishnahMatch[] {
  return extractHebrewLetters(name).map((letter, i) => ({
    letter,
    occurrenceIndex: i + 1,
    ref: mapping[letter],
  }));
}
