import type { HazkaraSlots, HazkaraTemplate } from './types.ts';

/**
 * Resolves a HazkaraTemplate's tokens against HazkaraSlots. `genderWord`
 * tokens resolve by the TEMPLATE's own gender (a fixed property of which of
 * the 4 variants was selected) - never inferred from the name, since Hebrew
 * name gender can't be reliably auto-detected. `parentPhrase` likewise uses
 * the template's gender for בן/בת (that marker describes the DECEASED, not
 * which parent was named - "בן שרה" is correct for a son named after his
 * mother).
 */
export function renderHazkara(template: HazkaraTemplate, slots: HazkaraSlots): string {
  return template.tokens
    .map((token) => {
      switch (token.type) {
        case 'literal':
          return token.text;
        case 'deceasedName':
          return slots.deceasedName;
        case 'parentPhrase': {
          if (!slots.parentName) return '';
          const relationWord = template.gender === 'male' ? 'בן' : 'בת';
          return ` ${relationWord} ${slots.parentName}`;
        }
        case 'genderWord':
          return template.gender === 'male' ? token.male : token.female;
        default: {
          const _exhaustive: never = token;
          return _exhaustive;
        }
      }
    })
    .join('');
}
