// Footer.tsx
// Pied de page global, reutilisable sur la page operatrice (/) et spectateur (/live).
// Affiche le credit officiel + courriel de contact commercial.

export default function Footer() {
  return (
    <footer className="w-full flex-shrink-0 bg-slate-900 py-2 px-4 text-center text-xs text-slate-400 border-t border-slate-800 select-none">
      Fabriqué et opéré par Diane Brochu et Paskal Brochu{" "}
      <a
        href="mailto:paskal.brochu@gmail.com"
        className="text-slate-300 hover:text-white underline underline-offset-2 transition-colors"
      >
        paskal.brochu@gmail.com
      </a>{" "}
      &copy; 2026
    </footer>
  );
}
