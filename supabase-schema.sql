-- ============================================================
--  Voeez – Supabase Schema Setup
--  Einmal im SQL-Editor von supabase.com ausführen.
--  Reihenfolge beibehalten (profiles vor user_stats).
-- ============================================================


-- ── 1. PROFILES ─────────────────────────────────────────────
-- Eine Zeile pro User, wird automatisch beim Signup angelegt.

create table if not exists public.profiles (
  id                     uuid        primary key references auth.users(id) on delete cascade,
  subscription_status    text        not null default 'inactive',
  -- 'trialing' | 'active' | 'past_due' | 'cancelled' | 'inactive'
  subscription_plan      text        null,
  -- 'monthly' | 'yearly' | 'lifetime' | null
  stripe_customer_id     text        unique null,
  stripe_subscription_id text        unique null,
  goose_name             text        null,
  beta_until             timestamptz null,
  -- Beta-Zugang läuft bis zu diesem Datum (null = kein Beta-Zugang)
  tos_accepted_at        timestamptz null,
  -- Zeitstempel der ToS/Datenschutz-Zustimmung beim Signup
  tos_version            text        null,
  -- Version der akzeptierten Bedingungen, z.B. '2026-03'
  updated_at             timestamptz not null default now()
);

-- Index für Stripe-Webhook-Lookups
create index if not exists profiles_stripe_customer_id_idx
  on public.profiles (stripe_customer_id);


-- ── 2. USER_STATS ────────────────────────────────────────────
-- Statistiken aus der macOS-App (per /api/sync/stats sync'd).

create table if not exists public.user_stats (
  user_id                       uuid        primary key references auth.users(id) on delete cascade,
  total_words                   bigint      not null default 0,
  total_transcriptions          integer     not null default 0,
  time_saved_minutes            integer     not null default 0,
  longest_transcription_words   integer     not null default 0,
  goose_stage                   text        not null default 'Egg',
  -- 'Egg' | 'Gosling' | 'Goose' | 'Elder Goose'
  feathers                      integer     not null default 0,
  days_used                     integer     not null default 0,
  updated_at                    timestamptz not null default now()
);


-- ── 3. ROW LEVEL SECURITY ────────────────────────────────────
-- Jeder User darf nur seine eigenen Daten lesen/schreiben.
-- Service-Role-Key (Stripe Webhook, Stats-Sync) umgeht RLS automatisch.

alter table public.profiles  enable row level security;
alter table public.user_stats enable row level security;

-- profiles: eigene Zeile lesen
create policy "Eigenes Profil lesen"
  on public.profiles for select
  using (auth.uid() = id);

-- profiles: eigene Zeile aktualisieren (nur nicht-sensitive Felder wie goose_name)
create policy "Eigenes Profil aktualisieren"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- user_stats: eigene Zeile lesen
create policy "Eigene Stats lesen"
  on public.user_stats for select
  using (auth.uid() = user_id);

-- user_stats: eigene Zeile einfügen/aktualisieren
create policy "Eigene Stats schreiben"
  on public.user_stats for insert
  with check (auth.uid() = user_id);

create policy "Eigene Stats aktualisieren"
  on public.user_stats for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── 4. AUTO-PROFILE BEI SIGNUP ───────────────────────────────
-- Trigger: nach jedem neuen User in auth.users → leeres Profil anlegen.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    subscription_status,
    beta_until,
    tos_accepted_at,
    tos_version
  )
  values (
    new.id,
    'inactive',
    now() + interval '30 days',
    (new.raw_user_meta_data->>'tos_accepted_at')::timestamptz,
    new.raw_user_meta_data->>'tos_version'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger nur anlegen wenn noch nicht vorhanden
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end;
$$;


-- ── 5. UPDATED_AT AUTOMATISCH SETZEN ────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger user_stats_set_updated_at
  before update on public.user_stats
  for each row execute procedure public.set_updated_at();


-- ── 6. FEEDBACK ──────────────────────────────────────────────
-- Feedback aus der macOS-App (/api/feedback).

create table if not exists public.feedback (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        references auth.users(id) on delete set null,
  email      text        null,
  text       text        not null,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

-- Nur der Service-Role-Key (Backend) darf Feedback einfügen.
-- (kein select-Policy für Nutzer nötig — Feedback ist nur für Admins sichtbar)
create policy "Service kann Feedback einfügen"
  on public.feedback for insert
  with check (true);
-- Hinweis: Da die API den Service-Role-Key nutzt, umgeht sie RLS ohnehin.
-- Diese Policy ist ein Fallback falls anon-Key genutzt wird.


-- ── MIGRATION: ToS-Felder nachrüsten (für bestehende Datenbanken) ──────────
-- Nur ausführen wenn die Spalten noch nicht existieren.
-- Im Supabase SQL-Editor ausführen.

alter table public.profiles
  add column if not exists tos_accepted_at timestamptz null,
  add column if not exists tos_version     text        null;

-- Trigger neu erstellen damit er tos_accepted_at/tos_version befüllt
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    subscription_status,
    beta_until,
    tos_accepted_at,
    tos_version
  )
  values (
    new.id,
    'inactive',
    now() + interval '30 days',
    (new.raw_user_meta_data->>'tos_accepted_at')::timestamptz,
    new.raw_user_meta_data->>'tos_version'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;


-- ── FERTIG ───────────────────────────────────────────────────
-- Danach in Supabase prüfen:
--   Table Editor → profiles, user_stats & feedback sollten erscheinen
--   Authentication → Policies → RLS-Regeln sichtbar
