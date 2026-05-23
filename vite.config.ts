import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// ============================================
// Configuration Vite pour D-IA-NE BINGO Tracker
// ============================================
// https://vite.dev/config/

export default defineConfig({
  plugins: [
    // Plugin React (déjà inclus par défaut, on le garde)
    react(),

    // ============================================
    // Plugin PWA - Rend l'app installable sur iPad/Android
    // ============================================
    VitePWA({
      // Stratégie de mise à jour : automatique quand l'app détecte une nouvelle version
      registerType: 'autoUpdate',

      // Active la PWA même en mode développement (utile pour tester sur iPad)
      devOptions: {
        enabled: true,
      },

      // ============================================
      // MANIFESTE PWA
      // C'est ce fichier qui décrit l'app à iOS/Android quand elle est installée
      // ============================================
      manifest: {
        name: 'D-IA-NE BINGO Tracker',
        short_name: 'D-IA-NE Bingo',
        description: 'Application de suivi de bingo en temps réel - Fabriqué et opéré par Diane Brochu',
        theme_color: '#0f172a',      // Couleur barre de statut (slate-900 sombre)
        background_color: '#0f172a', // Couleur splash screen au démarrage
        display: 'standalone',       // Plein écran sans barre du navigateur
        orientation: 'any',          // Fonctionne en portrait ET paysage
        lang: 'fr-CA',
        start_url: '/',              // L'app démarre toujours sur l'accueil

        // Icônes de l'app (on les générera dans une étape plus tard)
        // Pour l'instant on met l'icône par défaut Vite
        icons: [
          {
            src: '/vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },

      // ============================================
      // STRATÉGIE DE CACHE (mode hors-ligne)
      // L'app continue de fonctionner même sans internet
      // ============================================
      workbox: {
        // Met en cache les fichiers JS, CSS, HTML et images
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],

        // Mise en cache des polices Google Fonts pour usage hors-ligne
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],

  // ============================================
  // CONFIGURATION DU SERVEUR DE DÉVELOPPEMENT
  // ============================================
  server: {
    // host: true permet d'accéder au serveur depuis d'autres appareils du réseau local
    // (utile pour tester sur iPad/Android pendant le développement)
    host: true,
    port: 5173,
  },
})