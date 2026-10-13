import { FINAL_LETTER_MAP, isHebrewLetter, type HebrewLetter } from './letters.ts';

export interface NormalizedName {
  /** letters only, finals mapped to regular form, no nikud/spaces/punctuation — for letter-by-letter lookups */
  lettersOnly: string;
  /** the deceased's own name (parent name dropped if typed), NFC, nikud stripped, finals NOT mapped — for display */
  display: string;
}

// Combining nikud + cantillation block (U+0591–U+05C7). Does not touch the
// Hebrew letters block (U+05D0 onward). Written as \u escapes rather than
// literal combining-mark glyphs to avoid any editor/font rendering ambiguity.
const NIKUD_AND_CANTILLATION = /[\u0591-\u05C7]/g;
// Geresh (U+05F3) / gershayim (U+05F4) plus their common ASCII stand-ins
// (' and ") that people type on a standard keyboard.
const GERESH_GERSHAYIM = /[\u05F3\u05F4'"]/g;
// Splits off a trailing "בן X" / "בת X" parent-name suffix, if typed here
// out of habit — this module only cares about the deceased's own name.
const BEN_BAT_SPLIT = /\s+(?:בן|בת)\s+/;

/**
 * Normalizes raw Hebrew name input for the Tehillim-119/Mishnah-by-name
 * lookups: NFC-normalizes, strips nikud/geresh, collapses whitespace, and
 * drops a "בן/בת X" parent-name suffix if present. Non-Hebrew characters
 * (Latin letters, digits, stray punctuation) are silently filtered out of
 * `lettersOnly` but left alone in `display`.
 */
export function normalizeName(raw: string): NormalizedName {
  const nfc = raw.normalize('NFC');
  const stripped = nfc.replace(NIKUD_AND_CANTILLATION, '').replace(GERESH_GERSHAYIM, '');
  const collapsed = stripped.replace(/\s+/g, ' ').trim();
  const [core] = collapsed.split(BEN_BAT_SPLIT);
  const display = core.trim();

  const lettersOnly = Array.from(display)
    .map((ch) => FINAL_LETTER_MAP[ch] ?? ch)
    .filter(isHebrewLetter)
    .join('');

  return { lettersOnly, display };
}

/** Convenience accessor used by both the Tehillim-119 and Mishnah-by-name modules. */
export function extractHebrewLetters(raw: string): HebrewLetter[] {
  return Array.from(normalizeName(raw).lettersOnly).filter(isHebrewLetter);
}
