import type { VerseRange } from '../tehillim119/letterStanzaMap.ts';
import { createResultSection, renderEmptyState } from './resultSection.ts';

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
    renderEmptyState(container);
    return;
  }

  for (const range of ranges) {
    const label = range.source === 'neshama' ? 'נשמה' : 'אות השם';
    const section = createResultSection(range.letter, label, `stanza stanza--${range.source}`);

    const list = document.createElement('ol');
    list.className = 'verse-list prayer-text';
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
