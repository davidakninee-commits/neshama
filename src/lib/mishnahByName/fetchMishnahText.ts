import type { MishnahRef } from './types.ts';

interface MishnahTractate {
  chapters: string[][];
}

// Browser-only: fetches a tractate's JSON from public/data/mishnah/ (same
// static files the build-time loader reads from disk) and caches it in
// memory so repeated letters in a name don't re-fetch the same tractate.
const tractateCache = new Map<string, Promise<MishnahTractate>>();

function loadTractate(slug: string): Promise<MishnahTractate> {
  let pending = tractateCache.get(slug);
  if (!pending) {
    pending = fetch(`/data/mishnah/${slug}.json`).then((res) => {
      if (!res.ok) throw new Error(`Failed to fetch mishnah tractate "${slug}": ${res.status}`);
      return res.json();
    });
    tractateCache.set(slug, pending);
  }
  return pending;
}

/** Resolves a MishnahRef to its actual Hebrew text. */
export async function fetchMishnahText(ref: MishnahRef): Promise<string> {
  const tractate = await loadTractate(ref.tractateSlug);
  return tractate.chapters[ref.chapter - 1]?.[ref.mishnah - 1] ?? '';
}
