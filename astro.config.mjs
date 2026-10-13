// @ts-check
import { defineConfig } from 'astro/config';
import { VitePWA } from 'vite-plugin-pwa';

// https://astro.build/config
// Note: using vite-plugin-pwa directly (not the @vite-pwa/astro wrapper) because
// that wrapper's latest release (1.2.0) peer-depends on Astro <=5, while this
// project is on Astro 7. vite-plugin-pwa itself only peer-depends on Vite, so
// wiring it straight into Astro's underlying Vite config sidesteps the gap.
// Manifest/service-worker caching strategy is fleshed out in Phase 4; for now
// this just registers the plugin with minimal manifest fields.
export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'נשמה',
          short_name: 'נשמה',
          description: 'תהילים ומשניות לפי שם הנפטר',
          lang: 'he',
          dir: 'rtl',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#1a1a1a',
          icons: [],
        },
        workbox: {
          // Real cache-first asset strategy lands in Phase 4.
          globPatterns: [],
        },
      }),
    ],
  },
});
