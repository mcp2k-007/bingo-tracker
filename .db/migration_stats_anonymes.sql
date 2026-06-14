-- =====================================================================
-- D-IA-NE Bingo Tracker v1.2 -- Migration : metriques ANONYMES
-- Aucune donnee personnelle / aucun consentement requis (Loi 25).
-- A coller dans Supabase > SQL Editor. IDEMPOTENT : rejouable sans danger.
-- =====================================================================

-- 1) Nouvelles colonnes anonymes sur viewer_sessions ------------------
ALTER TABLE viewer_sessions
  ADD COLUMN IF NOT EXISTS device_type    text,      -- mobile | tablet | desktop
  ADD COLUMN IF NOT EXISTS browser        text,      -- Chrome, Safari, ...
  ADD COLUMN IF NOT EXISTS os             text,      -- Windows, Android, iOS, ...
  ADD COLUMN IF NOT EXISTS lang           text,      -- navigator.language (ex: fr-CA)
  ADD COLUMN IF NOT EXISTS timezone       text,      -- ex: America/Toronto
  ADD COLUMN IF NOT EXISTS is_pwa         boolean DEFAULT false, -- installee en PWA ?
  ADD COLUMN IF NOT EXISTS active_seconds integer DEFAULT 0,     -- temps onglet au 1er plan
  ADD COLUMN IF NOT EXISTS audio_listened boolean DEFAULT false, -- a ouvert le flux CIGN ?
  ADD COLUMN IF NOT EXISTS audio_seconds  integer DEFAULT 0,     -- duree d'ecoute CIGN
  ADD COLUMN IF NOT EXISTS utm_source     text,      -- ?utm_source=...
  ADD COLUMN IF NOT EXISTS utm_medium     text,      -- ?utm_medium=...
  ADD COLUMN IF NOT EXISTS utm_campaign   text;      -- ?utm_campaign=...

-- 2) Table des clics commanditaires (anonyme, agrege) -----------------
CREATE TABLE IF NOT EXISTS sponsor_clicks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id  text NOT NULL,                  -- ex: pmf, progym, st-michel, playground...
  session_id  text,                           -- lien souple vers viewer_sessions (anonyme)
  clicked_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sponsor_clicks_sponsor ON sponsor_clicks (sponsor_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_clicks_time    ON sponsor_clicks (clicked_at);

-- 3) RLS : memes regles communautaires que viewer_sessions ------------
ALTER TABLE sponsor_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon insert sponsor_clicks" ON sponsor_clicks;
CREATE POLICY "anon insert sponsor_clicks" ON sponsor_clicks
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon select sponsor_clicks" ON sponsor_clicks;
CREATE POLICY "anon select sponsor_clicks" ON sponsor_clicks
  FOR SELECT TO anon USING (true);

-- Fin. Ces "contenants" sont prets ; le code (hook + bandeau) viendra les remplir.
