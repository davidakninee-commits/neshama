import { extractHebrewLetters } from '../hebrew/normalizeName.ts';
import { LETTER_STANZA_MAP, NESHAMA_LETTERS, type VerseRange } from './letterStanzaMap.ts';

/**
 * Given a raw Hebrew name, returns the Tehillim-119 stanzas to recite: one
 * 8-verse stanza per letter of the name (in order, repeats included — not
 * deduplicated), followed by the stanzas for נ-ש-מ-ה. Returns [] for an
 * empty/non-Hebrew input.
 */
export function versesForName(name: string): VerseRange[] {
  const nameLetters = extractHebrewLetters(name);
  if (nameLetters.length === 0) return [];

  const ranges: VerseRange[] = [];
  let occurrenceIndex = 0;

  for (const letter of nameLetters) {
    occurrenceIndex += 1;
    const [startVerse, endVerse] = LETTER_STANZA_MAP[letter];
    ranges.push({ startVerse, endVerse, letter, source: 'name', occurrenceIndex });
  }

  for (const letter of NESHAMA_LETTERS) {
    occurrenceIndex += 1;
    const [startVerse, endVerse] = LETTER_STANZA_MAP[letter];
    ranges.push({ startVerse, endVerse, letter, source: 'neshama', occurrenceIndex });
  }

  return ranges;
}
