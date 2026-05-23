/** @type {import('tailwindcss').Config} */
export default {
  // Indique à Tailwind où chercher les classes CSS utilisées
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Polices personnalisées (identiques au prototype HTML de Paskal)
      fontFamily: {
        'sans': ['Outfit', 'sans-serif'],
        'display': ['"Space Grotesk"', 'sans-serif'],
      },
      // Animation "popIn" pour les numéros qui s'allument
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        popIn: 'popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
}