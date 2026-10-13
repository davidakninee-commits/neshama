export type Rite = 'sephardi' | 'ashkenazi' | 'mizrahi' | 'teiman';
export type Gender = 'male' | 'female';

export interface HazkaraSlots {
  /** already normalized/display form of the deceased's name */
  deceasedName: string;
  /** optional parent name, rendered as "בן X" / "בת X" (בן/בת chosen by the
   *  DECEASED's own gender, not by parentRelation - "בן שרה" is grammatically
   *  correct for a son named after his mother Sarah) */
  parentName?: string;
  /** which parent was named - informational only (drives the UI's input
   *  label, e.g. "שם האב" vs "שם האם"); does not change the rendered
   *  Hebrew grammar, which depends solely on the deceased's own gender */
  parentRelation?: 'father' | 'mother';
}

/**
 * A template is a sequence of literal strings and typed placeholder tokens,
 * so interpolation never does raw string-replace on user input.
 */
export type HazkaraToken =
  | { type: 'literal'; text: string }
  | { type: 'deceasedName' }
  | { type: 'parentPhrase' }
  | { type: 'genderWord'; male: string; female: string };

export interface HazkaraTemplate {
  rite: Rite;
  gender: Gender;
  /** display heading, e.g. "אל מלא רחמים (נוסח אשכנז) — לאיש" */
  title: string;
  tokens: HazkaraToken[];
}
