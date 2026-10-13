import type { MishnahMatch } from '../mishnahByName/types.ts';
import { fetchMishnahText } from '../mishnahByName/fetchMishnahText.ts';
import { createResultSection, renderEmptyState } from './resultSection.ts';

/**
 * Client-side renderer: given the MishnahMatches computed by
 * mishnahForName, fetches each referenced tractate (cached, so repeated
 * letters only fetch once) and builds the results DOM. Pure DOM API
 * throughout, same rationale as renderNameResults.
 */
export async function renderMishnahResults(
  container: HTMLElement,
  matches: MishnahMatch[]
): Promise<void> {
  container.replaceChildren();

  if (matches.length === 0) {
    renderEmptyState(container);
    return;
  }

  for (const match of matches) {
    const label = `${match.ref.tractateHe} ${match.ref.chapter}:${match.ref.mishnah}`;
    const section = createResultSection(match.letter, label, 'stanza stanza--name');

    const p = document.createElement('p');
    p.className = 'prayer-text mishnah-text';
    p.textContent = 'טוען...';
    section.appendChild(p);

    container.appendChild(section);

    fetchMishnahText(match.ref)
      .then((text) => {
        p.textContent = text;
      })
      .catch(() => {
        p.textContent = 'שגיאה בטעינת הטקסט.';
      });
  }
}
