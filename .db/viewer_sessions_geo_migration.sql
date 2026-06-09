-- ============================================
-- D-IA-NE Bingo Tracker v1.2 - Phase 3.6 (3/3)
-- MIGRATION : geolocalisation des sessions
-- ============================================
-- A executer UNE FOIS dans Supabase > SQL Editor (projet mcrglhtdxxugilojqgff).
-- Idempotent : "add column if not exists" -> peut etre relance sans danger.
--
-- Ajoute 3 colonnes derivees de l'IP (ville / region / pays). On ne stocke
-- JAMAIS l'IP brute (minimisation Loi 25) : seulement la geo grossiere, et
-- uniquement si le spectateur a accorde son consentement (getConsent() === 'granted').
--
-- La policy "anon update heartbeat" existante (using(true) / with check(true))
-- couvre deja la mise a jour de ces colonnes -> rien d'autre a changer.

alter table public.viewer_sessions
  add column if not exists city    text,   -- ex: "Sherbrooke"
  add column if not exists region  text,   -- ex: "Quebec"
  add column if not exists country text;   -- ex: "Canada"

-- Verification (optionnel) :
-- select id, session_id, city, region, country from public.viewer_sessions
--   order by started_at desc limit 10;
