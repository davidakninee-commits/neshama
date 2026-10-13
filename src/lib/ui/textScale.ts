// Adjustable text size (א-/א+ in the page banner) - persisted across page
// navigations via localStorage, since this is a multi-page static site, not
// an SPA. Scales .prayer-text's font-size via the --text-scale CSS custom
// property rather than the whole page, keeping UI chrome (buttons, nav) at
// a stable, predictable size.
const STORAGE_KEY = 'neshama:text-scale';
const MIN_SCALE = 0.85;
const MAX_SCALE = 1.5;
const STEP = 0.1;

function clamp(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(scale * 100) / 100));
}

function applyScale(scale: number): void {
  document.documentElement.style.setProperty('--text-scale', String(scale));
}

/** Call once per page load to restore the visitor's saved preference. */
export function initTextScale(): void {
  const saved = Number(localStorage.getItem(STORAGE_KEY));
  applyScale(saved >= MIN_SCALE && saved <= MAX_SCALE ? saved : 1);
}

export function increaseTextScale(): void {
  adjustTextScale(STEP);
}

export function decreaseTextScale(): void {
  adjustTextScale(-STEP);
}

function adjustTextScale(delta: number): void {
  const current = Number(getComputedStyle(document.documentElement).getPropertyValue('--text-scale')) || 1;
  const next = clamp(current + delta);
  applyScale(next);
  localStorage.setItem(STORAGE_KEY, String(next));
}
