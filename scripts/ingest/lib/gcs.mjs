// Thin wrapper around the public, unauthenticated Sefaria-Export GCS bucket.
// No API key / auth needed — every call below hits a public endpoint.

const BUCKET = 'sefaria-export';
const JSON_API = `https://www.googleapis.com/storage/v1/b/${BUCKET}/o`;
const MEDIA_BASE = `https://storage.googleapis.com/${BUCKET}`;

/**
 * Lists the immediate "subfolder" prefixes under a given prefix, using the
 * GCS JSON API's delimiter listing (simulates directory listing on an
 * otherwise flat object store).
 * @param {string} prefix
 * @returns {Promise<string[]>} subfolder prefixes, trimmed of the parent prefix and trailing slash
 */
export async function listPrefixes(prefix) {
  const url = `${JSON_API}?${new URLSearchParams({ prefix, delimiter: '/' })}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`listPrefixes(${prefix}) failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return (data.prefixes ?? []).map((p) => p.slice(prefix.length).replace(/\/$/, ''));
}

/**
 * Fetches object metadata (including reported byte size) without downloading the body.
 * @param {string} objectName full object path, e.g. "json/Tanakh/.../Tanach with Nikkud.json"
 */
export async function getObjectMeta(objectName) {
  const url = `${JSON_API}/${encodeURIComponent(objectName)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`getObjectMeta(${objectName}) failed: ${res.status} ${res.statusText}`);
  return res.json();
}

/**
 * Downloads an object's raw bytes as text (all source files here are JSON/UTF-8).
 * @param {string} objectName
 */
export async function downloadObjectText(objectName) {
  const url = `${MEDIA_BASE}/${encodeURIComponent(objectName)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`downloadObjectText(${objectName}) failed: ${res.status} ${res.statusText}`);
  return res.text();
}
