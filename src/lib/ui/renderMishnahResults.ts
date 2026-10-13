import type { MishnahMatch } from '../mishnahByName/types.ts';
import { fetchMishnahText } from '../mishnahByName/fetchMishnahText.ts';

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
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'נא להקליד שם בעברית.';
    container.appendChild(empty);
    return;
  }

  for (const match of matches) {
    const section = document.createElement('section');
    section.className = 'stanza stanza--name';

    const heading = document.createElement('h3');
    const badge = document.createElement('span');
    badge.className = 'letter-badge';
    badge.textContent = match.letter;
    heading.appendChild(badge);
    heading.append(` ${match.ref.tractateHe} ${match.ref.chapter}:${match.ref.mishnah}`);
    section.appendChild(heading);

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
