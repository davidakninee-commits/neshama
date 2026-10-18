import type { YahrzeitResult } from '../yahrzeit/calculateYahrzeit.ts';

const GREGORIAN_FORMAT: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

export function renderYahrzeitResults(container: HTMLElement, result: YahrzeitResult): void {
  container.replaceChildren();

  const deathDateP = document.createElement('p');
  deathDateP.className = 'yahrzeit-death-date';
  const deathDateLabel = document.createElement('strong');
  deathDateLabel.textContent = 'תאריך הפטירה בלוח העברי: ';
  deathDateP.appendChild(deathDateLabel);
  deathDateP.append(result.hebrewDeathDateLabel);
  container.appendChild(deathDateP);

  const heading = document.createElement('h3');
  heading.textContent = 'יארצייטים קרובים';
  container.appendChild(heading);

  const list = document.createElement('ul');
  list.className = 'yahrzeit-list';

  for (const occ of result.upcoming) {
    const li = document.createElement('li');

    const hebrewSpan = document.createElement('span');
    hebrewSpan.className = 'yahrzeit-hebrew prayer-text';
    hebrewSpan.textContent = occ.hebrewLabel;
    li.appendChild(hebrewSpan);

    const gregorianSpan = document.createElement('span');
    gregorianSpan.className = 'yahrzeit-gregorian';
    gregorianSpan.textContent = occ.gregorianDate.toLocaleDateString('he-IL', GREGORIAN_FORMAT);
    li.appendChild(gregorianSpan);

    if (occ.note) {
      const noteP = document.createElement('p');
      noteP.className = 'yahrzeit-note';
      noteP.textContent = occ.note;
      li.appendChild(noteP);
    }

    list.appendChild(li);
  }

  container.appendChild(list);
}
