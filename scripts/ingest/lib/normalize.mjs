/**
 * Shared text normalization for ingested Hebrew source text.
 * Unicode-normalizes to NFC (combining nikud/cantillation marks in canonical
 * order) and trims incidental whitespace — content itself is left untouched.
 */
export function normalizeText(raw) {
  return raw.normalize('NFC').trim();
}

/** Applies normalizeText to every string in a flat or nested array, in place conceptually (returns a new structure). */
export function normalizeDeep(value) {
  if (typeof value === 'string') return normalizeText(value);
  if (Array.isArray(value)) return value.map(normalizeDeep);
  return value;
}
