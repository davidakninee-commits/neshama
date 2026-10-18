import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toJewishDate, toGregorianDate } from 'jewish-date';
import { calculateYahrzeit } from './calculateYahrzeit.ts';

test('returns the correct Hebrew date label for the death date itself', () => {
  const deathDate = toGregorianDate({ year: 5783, monthName: 'Iyyar', day: 18 });
  const { hebrewDeathDateLabel } = calculateYahrzeit(deathDate, { fromDate: deathDate });
  assert.ok(hebrewDeathDateLabel.includes('אייר'));
  assert.ok(hebrewDeathDateLabel.includes('תשפ'));
});

test('ordinary months: every projected occurrence lands on the exact same Hebrew day/month', () => {
  const deathDate = toGregorianDate({ year: 5783, monthName: 'Iyyar', day: 18 });
  const { upcoming } = calculateYahrzeit(deathDate, { count: 5, fromDate: deathDate });
  assert.equal(upcoming.length, 5);
  for (const occ of upcoming) {
    const hebrew = toJewishDate(occ.gregorianDate);
    assert.equal(hebrew.monthName, 'Iyyar');
    assert.equal(hebrew.day, 18);
    assert.equal(occ.note, undefined, 'ordinary months should never produce a note');
  }
});

test('respects the requested count', () => {
  const deathDate = toGregorianDate({ year: 5783, monthName: 'Tishri', day: 1 });
  assert.equal(calculateYahrzeit(deathDate, { count: 1, fromDate: deathDate }).upcoming.length, 1);
  assert.equal(calculateYahrzeit(deathDate, { count: 7, fromDate: deathDate }).upcoming.length, 7);
});

test('every occurrence is on or after fromDate', () => {
  const deathDate = toGregorianDate({ year: 5780, monthName: 'Shevat', day: 5 });
  const fromDate = toGregorianDate({ year: 5783, monthName: 'Nisan', day: 1 });
  const { upcoming } = calculateYahrzeit(deathDate, { count: 4, fromDate });
  for (const occ of upcoming) {
    assert.ok(occ.gregorianDate.getTime() >= fromDate.getTime());
  }
});

test('death in a regular year\'s single Adar: projecting into a leap year lands on Adar II with a note', () => {
  // 5783 is confirmed non-leap (single Adar); 5784 is confirmed leap.
  const deathDate = toGregorianDate({ year: 5783, monthName: 'Adar', day: 10 });
  const fromDate = toGregorianDate({ year: 5784, monthName: 'Tishri', day: 1 }); // start of 5784
  const { upcoming } = calculateYahrzeit(deathDate, { count: 1, fromDate });
  assert.equal(upcoming.length, 1);
  const hebrew = toJewishDate(upcoming[0].gregorianDate);
  assert.equal(hebrew.year, 5784);
  assert.equal(hebrew.monthName, 'AdarII');
  assert.equal(hebrew.day, 10);
  assert.ok(upcoming[0].note?.includes('אדר ב'), 'expected a note explaining the Adar II convention');
});

test('death in a leap year\'s AdarI: projecting into a regular year collapses to the single Adar, no note', () => {
  // 5784 is confirmed leap (AdarI/AdarII); 5785 is confirmed non-leap.
  const deathDate = toGregorianDate({ year: 5784, monthName: 'AdarI', day: 10 });
  const fromDate = toGregorianDate({ year: 5785, monthName: 'Tishri', day: 1 });
  const { upcoming } = calculateYahrzeit(deathDate, { count: 1, fromDate });
  const hebrew = toJewishDate(upcoming[0].gregorianDate);
  assert.equal(hebrew.year, 5785);
  assert.equal(hebrew.monthName, 'Adar');
  assert.equal(hebrew.day, 10);
  assert.equal(upcoming[0].note, undefined, 'collapsing AdarI/II into the single Adar is undisputed - no note expected');
});

test('death on Cheshvan 30: projecting into a year where Cheshvan is short lands on 1 Kislev with an explanatory note', () => {
  // 5780 confirmed Cheshvan=30 days; 5781 confirmed Cheshvan=29 days.
  const deathDate = toGregorianDate({ year: 5780, monthName: 'Cheshvan', day: 30 });
  const fromDate = toGregorianDate({ year: 5781, monthName: 'Tishri', day: 1 });
  const { upcoming } = calculateYahrzeit(deathDate, { count: 1, fromDate });
  const hebrew = toJewishDate(upcoming[0].gregorianDate);
  assert.equal(hebrew.year, 5781);
  assert.equal(hebrew.monthName, 'Kislev');
  assert.equal(hebrew.day, 1);
  assert.ok(upcoming[0].note?.includes('חשוון'), 'expected a note naming the deficient month');
  assert.ok(upcoming[0].note?.includes('חסר'), 'expected the note to explain the month was short');
});

test('death on Cheshvan 30 in a year where the NEXT year is also 30 days: no note needed', () => {
  // Both 5780 and 5783 confirmed Cheshvan=30 days.
  const deathDate = toGregorianDate({ year: 5780, monthName: 'Cheshvan', day: 30 });
  const fromDate = toGregorianDate({ year: 5783, monthName: 'Tishri', day: 1 });
  const { upcoming } = calculateYahrzeit(deathDate, { count: 1, fromDate });
  const hebrew = toJewishDate(upcoming[0].gregorianDate);
  assert.equal(hebrew.monthName, 'Cheshvan');
  assert.equal(hebrew.day, 30);
  assert.equal(upcoming[0].note, undefined);
});
