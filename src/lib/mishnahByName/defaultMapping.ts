import type { MishnahLetterMapping } from './types.ts';

/**
 * PLACEHOLDER / BEST-EFFORT DEFAULT — NOT HALACHICALLY REVIEWED.
 *
 * The custom of learning Mishnayot whose first word spells out the
 * deceased's name (by letter) has no single canonical published table, unlike
 * Tehillim 119's near-universal custom. This table ships so the feature is
 * wired end-to-end and testable: every entry points at a REAL, existing
 * mishnah in the bundled data (chapter 1, mishnah 1 of a real tractate), so
 * nothing shown is ever fabricated text — but the LETTER MATCHING itself is
 * arbitrary (just the first 22 tractates in ש"ס order, one per letter) and
 * does NOT reflect the actual "first word begins with this letter" custom.
 *
 * MUST be replaced with a reviewed table (or a documented published source)
 * before this feature is presented as halachically authoritative. See the
 * `isPlaceholder` flag below, which drives the on-page disclaimer.
 */
export const isPlaceholder = true;

export const DEFAULT_MISHNAH_LETTER_MAPPING: MishnahLetterMapping = {
  א: { tractateSlug: 'berakhot', tractateHe: 'משנה ברכות', chapter: 1, mishnah: 1 },
  ב: { tractateSlug: 'peah', tractateHe: 'משנה פאה', chapter: 1, mishnah: 1 },
  ג: { tractateSlug: 'demai', tractateHe: 'משנה דמאי', chapter: 1, mishnah: 1 },
  ד: { tractateSlug: 'kilayim', tractateHe: 'משנה כלאים', chapter: 1, mishnah: 1 },
  ה: { tractateSlug: 'sheviit', tractateHe: 'משנה שביעית', chapter: 1, mishnah: 1 },
  ו: { tractateSlug: 'terumot', tractateHe: 'משנה תרומות', chapter: 1, mishnah: 1 },
  ז: { tractateSlug: 'maasrot', tractateHe: 'משנה מעשרות', chapter: 1, mishnah: 1 },
  ח: { tractateSlug: 'maaser-sheni', tractateHe: 'משנה מעשר שני', chapter: 1, mishnah: 1 },
  ט: { tractateSlug: 'challah', tractateHe: 'משנה חלה', chapter: 1, mishnah: 1 },
  י: { tractateSlug: 'orlah', tractateHe: 'משנה ערלה', chapter: 1, mishnah: 1 },
  כ: { tractateSlug: 'bikkurim', tractateHe: 'משנה ביכורים', chapter: 1, mishnah: 1 },
  ל: { tractateSlug: 'shabbat', tractateHe: 'משנה שבת', chapter: 1, mishnah: 1 },
  מ: { tractateSlug: 'eruvin', tractateHe: 'משנה עירובין', chapter: 1, mishnah: 1 },
  נ: { tractateSlug: 'pesachim', tractateHe: 'משנה פסחים', chapter: 1, mishnah: 1 },
  ס: { tractateSlug: 'shekalim', tractateHe: 'משנה שקלים', chapter: 1, mishnah: 1 },
  ע: { tractateSlug: 'yoma', tractateHe: 'משנה יומא', chapter: 1, mishnah: 1 },
  פ: { tractateSlug: 'sukkah', tractateHe: 'משנה סוכה', chapter: 1, mishnah: 1 },
  צ: { tractateSlug: 'beitzah', tractateHe: 'משנה ביצה', chapter: 1, mishnah: 1 },
  ק: { tractateSlug: 'rosh-hashanah', tractateHe: 'משנה ראש השנה', chapter: 1, mishnah: 1 },
  ר: { tractateSlug: 'taanit', tractateHe: 'משנה תענית', chapter: 1, mishnah: 1 },
  ש: { tractateSlug: 'megillah', tractateHe: 'משנה מגילה', chapter: 1, mishnah: 1 },
  ת: { tractateSlug: 'moed-katan', tractateHe: 'משנה מועד קטן', chapter: 1, mishnah: 1 },
};
