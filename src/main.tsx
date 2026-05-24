// ============================================
// D-IA/NE BINGO TRACKER v1.1
// Point d'entree de l'application
// ============================================
// Routing :
//   /       → Interface operatrice (Diane)
//   /live   → Page spectateur temps reel

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import LiveView from './pages/LiveView.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Interface operatrice (Diane) */}
        <Route path="/" element={<App />} />

        {/* Page spectateur temps reel (lecture seule) */}
        <Route path="/live" element={<LiveView />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)