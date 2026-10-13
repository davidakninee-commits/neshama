/**
 * Shared DOM scaffold used by both renderNameResults (Tehillim-119-by-name)
 * and renderMishnahResults (Mishnah-by-name): a <section> whose heading is
 * a gold letter-badge followed by a label. Extracted after noticing both
 * renderers had independently grown near-identical section/heading/badge
 * construction - exactly the kind of duplication that made the RTL list-
 * padding bug need fixing in three places instead of one.
 *
 * Callers append their own body content (a verse list, a fetched
 * paragraph, etc.) to the returned section.
 */
export function createResultSection(letter: string, label: string, className: string): HTMLElement {
  const section = document.createElement('section');
  section.className = className;

  const heading = document.createElement('h3');
  const badge = document.createElement('span');
  badge.className = 'letter-badge';
  badge.textContent = letter;
  heading.appendChild(badge);
  heading.append(` ${label}`);
  section.appendChild(heading);

  return section;
}

/** Shared "type a name first" empty state, shown by both by-name flows. */
export function renderEmptyState(container: HTMLElement, message = 'נא להקליד שם בעברית.'): void {
  const empty = document.createElement('p');
  empty.className = 'empty-state';
  empty.textContent = message;
  container.appendChild(empty);
}
