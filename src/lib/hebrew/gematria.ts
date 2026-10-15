/**
 * Converts a positive integer to a Hebrew numeral (גימטריה), e.g.
 * 119 -> "קי״ט" (Psalm 119's traditional citation), 15 -> "ט״ו", 1 -> "א׳".
 *
 * Two halachic/traditional exceptions are mandatory, not optional styling:
 * 15 and 16 are never written as י+ה (10+5) or י+ו (10+6), because those
 * combinations spell out (or nearly spell out) forms of the Tetragrammaton.
 * The universal convention is ט״ו (9+6) and ט״ז (9+7) instead.
 *
 * Punctuation: a single-letter numeral gets a trailing geresh (א׳), a
 * multi-letter numeral gets a gershayim (״) before its last letter (קי״ט,
 * not קיט׳ or קי׳ט).
 */
export function toHebrewNumeral(num: number): string {
  if (!Number.isInteger(num) || num <= 0) {
    throw new RangeError(`toHebrewNumeral expects a positive integer, got ${num}`);
  }

  let n = num;
  let letters = '';

  // Repeated ת (400) for the hundreds beyond 300.
  while (n >= 400) {
    letters += 'ת';
    n -= 400;
  }

  const hundreds: Array<[number, string]> = [
    [300, 'ש'],
    [200, 'ר'],
    [100, 'ק'],
  ];
  for (const [value, letter] of hundreds) {
    if (n >= value) {
      letters += letter;
      n -= value;
      break;
    }
  }

  if (n === 15) {
    letters += 'טו';
    n = 0;
  } else if (n === 16) {
    letters += 'טז';
    n = 0;
  } else {
    const tens: Array<[number, string]> = [
      [90, 'צ'],
      [80, 'פ'],
      [70, 'ע'],
      [60, 'ס'],
      [50, 'נ'],
      [40, 'מ'],
      [30, 'ל'],
      [20, 'כ'],
      [10, 'י'],
    ];
    for (const [value, letter] of tens) {
      if (n >= value) {
        letters += letter;
        n -= value;
        break;
      }
    }

    const ones: Array<[number, string]> = [
      [9, 'ט'],
      [8, 'ח'],
      [7, 'ז'],
      [6, 'ו'],
      [5, 'ה'],
      [4, 'ד'],
      [3, 'ג'],
      [2, 'ב'],
      [1, 'א'],
    ];
    for (const [value, letter] of ones) {
      if (n >= value) {
        letters += letter;
        n -= value;
        break;
      }
    }
  }

  if (letters.length === 1) {
    return `${letters}׳`;
  }
  return `${letters.slice(0, -1)}״${letters.slice(-1)}`;
}
