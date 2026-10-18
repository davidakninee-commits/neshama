import { toJewishDate, toGregorianDate, formatJewishDateInHebrew, type JewishMonthType } from 'jewish-date';

export interface YahrzeitOccurrence {
  gregorianDate: Date;
  hebrewLabel: string;
  /** set when the projected date needed a halachic adjustment worth explaining to the user */
  note?: string;
}

export interface YahrzeitResult {
  /** the Hebrew-calendar date of death itself, e.g. "י״ז בכסלו תשפ״ד" */
  hebrewDeathDateLabel: string;
  upcoming: YahrzeitOccurrence[];
}

const VARIABLE_LENGTH_MONTHS: ReadonlySet<JewishMonthType> = new Set(['Cheshvan', 'Kislev']);

const HEBREW_MONTH_LABEL: Partial<Record<JewishMonthType, string>> = {
  Cheshvan: 'חשוון',
  Kislev: 'כסלו',
};

/** Standard 19-year Metonic cycle leap-year rule (years 3,6,8,11,14,17,19 of the cycle). */
function isHebrewLeapYear(year: number): boolean {
  return (7 * year + 1) % 19 < 7;
}

function toLocalMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Projects a single death date forward into a given Hebrew year, applying
 * the two halachically-relevant adjustments:
 *
 * 1. Adar: a death in the single "Adar" of a regular year is projected,
 *    by the predominant custom, onto Adar II of a leap target year (with
 *    an explicit note, since this specific case is genuinely disputed -
 *    some communities use Adar I instead). A death in AdarI/AdarII of a
 *    leap year collapses onto the single "Adar" of a regular target year
 *    with no note, since that mapping is essentially undisputed.
 * 2. Cheshvan/Kislev (variable-length months): if the target year's month
 *    doesn't have a 30th day, requesting day 30 lands on the 1st of the
 *    following month - which is itself the standard custom, not an error -
 *    but we still add a note explaining why the label doesn't say the
 *    original month.
 */
function projectIntoYear(
  deathDay: number,
  deathMonth: JewishMonthType,
  targetYear: number
): { gregorianDate: Date; note?: string } {
  let monthName: JewishMonthType = deathMonth;
  let note: string | undefined;

  const targetIsLeap = isHebrewLeapYear(targetYear);

  if (deathMonth === 'Adar') {
    if (targetIsLeap) {
      monthName = 'AdarII';
      note =
        'השנה מעוברת. לפי המנהג הרווח מציינים באדר ב׳, אך יש נוהגים באדר א׳ — כדאי לבדוק מנהג המשפחה או להתייעץ עם רב.';
    }
  } else if ((deathMonth === 'AdarI' || deathMonth === 'AdarII') && !targetIsLeap) {
    monthName = 'Adar';
  }

  let gregorianDate = toGregorianDate({ year: targetYear, monthName, day: deathDay });

  if (VARIABLE_LENGTH_MONTHS.has(deathMonth)) {
    const roundTrip = toJewishDate(gregorianDate);
    if (roundTrip.monthName !== monthName || roundTrip.day !== deathDay) {
      const monthLabel = HEBREW_MONTH_LABEL[deathMonth] ?? deathMonth;
      note = `חודש ${monthLabel} היה חסר בשנה זו (כ״ט ימים בלבד), ולכן הציון חל באחד בחודש הבא, כמנהג.`;
    }
  }

  return { gregorianDate, note };
}

/**
 * Given a Gregorian date of death, returns that date's Hebrew-calendar
 * equivalent plus the next `count` upcoming yahrzeit occurrences (projected
 * forward from `fromDate`, which defaults to today - tests should always
 * pass an explicit fromDate to stay deterministic).
 */
export function calculateYahrzeit(
  deathDate: Date,
  options?: { count?: number; fromDate?: Date }
): YahrzeitResult {
  const count = options?.count ?? 3;
  const fromDate = toLocalMidnight(options?.fromDate ?? new Date());

  const deathHebrew = toJewishDate(deathDate);
  const hebrewDeathDateLabel = formatJewishDateInHebrew(deathHebrew);

  const upcoming: YahrzeitOccurrence[] = [];
  let year = toJewishDate(fromDate).year;
  let safety = 0;

  while (upcoming.length < count && safety < 60) {
    safety++;
    const { gregorianDate, note } = projectIntoYear(deathHebrew.day, deathHebrew.monthName, year);
    const normalized = toLocalMidnight(gregorianDate);

    if (normalized.getTime() >= fromDate.getTime()) {
      upcoming.push({
        gregorianDate: normalized,
        hebrewLabel: formatJewishDateInHebrew(toJewishDate(normalized)),
        note,
      });
    }
    year++;
  }

  return { hebrewDeathDateLabel, upcoming };
}
