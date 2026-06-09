// ============================================
// D-IA-NE Bingo Tracker v1.2
// Point d'entree de l'application
// ============================================
// Routing :
//   /                -> Interface operatrice (Diane)
//   /live            -> Page spectateur temps reel (lecture seule)
//   /stats           -> Dashboard analytics commanditaires (protege par mot de passe)
//   /confidentialite -> Politique de confidentialite (Loi 25)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import LiveView from './pages/LiveView.tsx'
import Stats from './pages/Stats.tsx'
import Confidentialite from './pages/Confidentialite.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Interface operatrice (Diane) */}
        <Route path="/" element={<App />} />
        {/* Page spectateur temps reel (lecture seule) */}
        <Route path="/live" element={<LiveView />} />
        {/* Dashboard analytics commanditaires (protege par mot de passe) */}
        <Route path="/stats" element={<Stats />} />
        {/* Politique de confidentialite (Loi 25) */}
        <Route path="/confidentialite" element={<Confidentialite />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
