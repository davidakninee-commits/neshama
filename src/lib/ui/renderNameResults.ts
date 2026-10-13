import type { VerseRange } from '../tehillim119/letterStanzaMap.ts';

/**
 * Client-side (browser) renderer: given the full 176-verse text of Psalm 119
 * and the stanzas computed by versesForName, builds the results DOM. Pure
 * DOM API (createElement/textContent) throughout — never innerHTML with
 * user-controlled text — since the stanza letters come from user input.
 */
export function renderNameResults(
  container: HTMLElement,
  verses119: string[],
  ranges: VerseRange[]
): void {
  container.replaceChildren();

  if (ranges.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'נא להקליד שם בעברית.';
    container.appendChild(empty);
    return;
  }

  for (const range of ranges) {
    const section = document.createElement('section');
    section.className = `stanza stanza--${range.source}`;

    const heading = document.createElement('h3');
    heading.textContent =
      range.source === 'neshama' ? `נשמה — אות ${range.letter}` : `אות ${range.letter}`;
    section.appendChild(heading);

    const list = document.createElement('ol');
    list.className = 'verse-list';
    list.start = range.startVerse;
    for (let v = range.startVerse; v <= range.endVerse; v++) {
      const li = document.createElement('li');
      li.textContent = verses119[v - 1] ?? '';
      list.appendChild(li);
    }
    section.appendChild(list);

    container.appendChild(section);
  }
}
