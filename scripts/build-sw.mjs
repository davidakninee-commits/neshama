#!/usr/bin/env node
// Generates dist/sw.js by scanning the already-built static site, using
// workbox-build directly rather than a Vite/Rollup plugin. vite-plugin-pwa's
// generateSW strategy hooks Vite's closeBundle, which expects a traditional
// SPA build with an index.html bundle entry - Astro's static-page generator
// doesn't feed it that, so the hook silently never fires and no sw.js gets
// written. workbox-build's generateSW() has no such assumption: it just
// globs a directory and writes a precaching service worker, which is
// exactly "run this against my finished static site" - the right tool for
// a post-`astro build` step.

import { generateSW } from 'workbox-build';
import { fileURLToPath } from 'node:url';

const DIST_DIR = fileURLToPath(new URL('../dist', import.meta.url));

const { count, size, warnings } = await generateSW({
  globDirectory: DIST_DIR,
  // Precache the entire built site (all pages + text data + fonts + CSS/JS)
  // at install time, not just visited pages - total content is only a few
  // MB, and this is what makes "scan the QR once, works offline after"
  // actually true rather than only for pages a visitor happened to click.
  globPatterns: ['**/*.{html,css,js,json,woff2,png,svg,ico,webmanifest}'],
  swDest: `${DIST_DIR}/sw.js`,
  // No single precached file should ever be huge; this just guards against
  // accidentally shipping something unexpectedly large.
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
  // Astro (trailingSlash: 'never') emits directory-style files
  // (tehillim/119/index.html) but every link/navigation in this site
  // requests the clean, no-trailing-slash URL (/tehillim/119). Workbox's
  // built-in directoryIndex matching only rewrites the *trailing-slash*
  // form (/tehillim/119/ -> .../index.html) - confirmed by testing with
  // `fetch(url, {cache: 'only-if-cached'})` against a real build, which
  // precache-matched "/" but failed every nested clean URL. Renaming each
  // ".../index.html" precache entry to its clean-URL equivalent (no
  // duplication - nothing in this app ever requests the literal
  // "/index.html" path) is what makes precache matching line up with what
  // the site actually requests.
  manifestTransforms: [
    (entries) => ({
      manifest: entries.map((entry) =>
        entry.url !== 'index.html' && entry.url.endsWith('/index.html')
          ? { ...entry, url: entry.url.slice(0, -'/index.html'.length) }
          : entry
      ),
    }),
  ],
});

for (const warning of warnings) {
  console.warn('workbox-build warning:', warning);
}

console.log(`Generated dist/sw.js: precached ${count} files, ${(size / 1024 / 1024).toFixed(2)} MB.`);
