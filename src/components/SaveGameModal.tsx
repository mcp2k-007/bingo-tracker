// ============================================
// D-IA-NE BINGO TRACKER v1.0
// Composant : Fenetre de sauvegarde (modale)
// ============================================
// Affichee apres avoir clique "Terminer & Sauvegarder".
// Permet de telecharger les fichiers .txt et .json
// par des clics manuels (compatible iPad Safari).

import { downloadTextFile, downloadJsonFile, getTextPreview, type SavedGame } from '../lib/exportGame'

interface SaveGameModalProps {
  game: SavedGame      // La partie a sauvegarder
  onClose: () => void  // Fonction pour fermer la modale
}

function SaveGameModal({ game, onClose }: SaveGameModalProps) {
  // Apercu du contenu texte (pour montrer a l'utilisateur)
  const preview = getTextPreview(game)

  return (
    // Fond semi-transparent qui couvre tout l'ecran
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">

      {/* La boite de dialogue */}
      <div className="bg-slate-800 rounded-2xl border border-slate-600 shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">

        {/* En-tete de la modale */}
        <div className="bg-emerald-600 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="font-display text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-circle-check"></i>
            Partie sauvegardee !
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition"
            title="Fermer"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Corps : infos + apercu */}
        <div className="p-5 overflow-y-auto flex-grow">

          {/* Resume rapide */}
          <p className="text-slate-300 text-sm mb-4">
            La partie <span className="font-bold text-white">"{game.name}"</span> est prete.
            Telecharge les fichiers que tu souhaites conserver :
          </p>

          {/* Apercu du contenu texte */}
          <div className="bg-slate-950 rounded-lg border border-slate-700 p-3 mb-4">
            <pre className="text-slate-300 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {preview}
            </pre>
          </div>
        </div>

        {/* Pied : boutons de telechargement */}
        <div className="p-5 border-t border-slate-700 flex-shrink-0 flex flex-col sm:flex-row gap-3">

          {/* Bouton telecharger .txt */}
          <button
            onClick={() => downloadTextFile(game)}
            className="flex-1 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-file-lines"></i>
            Telecharger le .TXT
          </button>

          {/* Bouton telecharger .json */}
          <button
            onClick={() => downloadJsonFile(game)}
            className="flex-1 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-file-code"></i>
            Telecharger le .JSON
          </button>
        </div>

        {/* Bouton fermer en bas */}
        <div className="px-5 pb-5 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-200 font-semibold py-2.5 px-4 rounded-xl transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

export default SaveGameModal