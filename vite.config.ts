import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Ми-8: Авиатехник v9.0 - ТВ3-117ВМ',
          short_name: 'Авиатехник Ми-8',
          description: 'PWA-приложение авиатехника Ми-8 с базой ТВ3-117ВМ',
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          icons: [
            {
              src: '192.svg',
              sizes: '192x192',
              type: 'image/svg+xml'
            },
            {
              src: '512.svg',
              sizes: '512x512',
              type: 'image/svg+xml'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
