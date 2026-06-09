-- ============================================
-- D-IA-NE Bingo Tracker v1.2 - Phase 3.6
-- Table : viewer_sessions (analytics commanditaires)
-- ============================================
-- A executer dans Supabase > SQL Editor (projet mcrglhtdxxugilojqgff).
-- Idempotent : peut etre relance sans danger (IF NOT EXISTS / DROP POLICY IF EXISTS).
--
-- Modele : 1 ligne = 1 session de spectateur sur /live.
--   - INSERT a l'arrivee du spectateur (on recupere l'id).
--   - UPDATE de last_seen_at toutes les ~20s (heartbeat) tant qu'il regarde.
--   - UPDATE city/region/country UNE fois, si consentement Loi 25 accorde (geoloc).
--   - La duree se calcule = last_seen_at - started_at (pas stockee).
--   - Une session est "active" si last_seen_at est recent (< ~45s).

-- --------------------------------------------
-- 1. La table
-- --------------------------------------------
create table if not exists public.viewer_sessions (
  id           uuid        primary key default gen_random_uuid(),
  session_id   text        not null,                 -- id stable par onglet/appareil (genere cote client)
  started_at   timestamptz not null default now(),   -- arrivee du spectateur
  last_seen_at timestamptz not null default now(),   -- dernier heartbeat (mis a jour en continu)
  user_agent   text,                                 -- info appareil (optionnel, anonyme)
  referrer     text,                                 -- provenance (optionnel)
  city         text,                                 -- geoloc grossiere (consentement Loi 25 requis)
  region       text,                                 -- ex: "Quebec"
  country      text                                  -- ex: "Canada"
);

-- Pour une base deja existante (prod), s'assurer que les colonnes geo sont la :
alter table public.viewer_sessions
  add column if not exists city    text,
  add column if not exists region  text,
  add column if not exists country text;

-- --------------------------------------------
-- 2. Index (pour des requetes /stats rapides)
-- --------------------------------------------
create index if not exists idx_viewer_sessions_started_at
  on public.viewer_sessions (started_at);

create index if not exists idx_viewer_sessions_last_seen_at
  on public.viewer_sessions (last_seen_at);

create index if not exists idx_viewer_sessions_session_id
  on public.viewer_sessions (session_id);

-- --------------------------------------------
-- 3. Row Level Security (RLS)
-- --------------------------------------------
-- L'app utilise la cle ANON (publique, dans le bundle). On autorise donc :
--   - INSERT : tout spectateur cree sa session
--   - UPDATE : heartbeat (last_seen_at) + geoloc (city/region/country) par id
--   - SELECT : /stats lit les sessions (acces protege cote client par mot de passe)
--
-- NOTE SECURITE : "using (true)" est volontairement permissif (contexte communautaire,
-- faible enjeu). L'id de session est un UUID (difficile a deviner), ce qui limite en
-- pratique les UPDATE abusifs. Pour un verrouillage fort -> Supabase Auth (v1.3).

alter table public.viewer_sessions enable row level security;

drop policy if exists "anon insert viewer_session" on public.viewer_sessions;
create policy "anon insert viewer_session"
  on public.viewer_sessions
  for insert
  to anon
  with check (true);

drop policy if exists "anon update heartbeat" on public.viewer_sessions;
create policy "anon update heartbeat"
  on public.viewer_sessions
  for update
  to anon
  using (true)
  with check (true);

drop policy if exists "anon select for stats" on public.viewer_sessions;
create policy "anon select for stats"
  on public.viewer_sessions
  for select
  to anon
  using (true);

-- --------------------------------------------
-- 4. Verification (optionnel - decommente pour tester)
-- --------------------------------------------
-- insert into public.viewer_sessions (session_id, user_agent) values ('test-123', 'manuel');
-- select * from public.viewer_sessions order by started_at desc limit 5;
