import type { HebrewLetter } from '../hebrew/letters.ts';

export interface MishnahRef {
  /** matches a data/mishnah/{slug}.json filename under public/ */
  tractateSlug: string;
  /** Hebrew tractate name, denormalized for display without a content lookup */
  tractateHe: string;
  /** 1-indexed */
  chapter: number;
  /** 1-indexed, within chapter */
  mishnah: number;
}

export type MishnahLetterMapping = Record<HebrewLetter, MishnahRef>;

export interface MishnahMatch {
  /** the Hebrew letter of the name this match serves */
  letter: HebrewLetter;
  /** 1-based position among all returned matches (distinguishes repeated letters) */
  occurrenceIndex: number;
  ref: MishnahRef;
}
