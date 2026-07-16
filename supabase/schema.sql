-- ============================================================
--  Digital Wedding Invitation — RSVP / "Doa & Ucapan" schema
--  Run this in the Supabase SQL Editor (Dashboard → SQL Editor).
-- ============================================================

create table if not exists public.rsvps (
  id                uuid primary key default gen_random_uuid(),
  guest_name        text not null check (char_length(guest_name) between 1 and 80),
  attendance_status text not null check (attendance_status in ('attending', 'not_attending', 'maybe')),
  message           text check (message is null or char_length(message) <= 1000),
  created_at        timestamptz not null default timezone('utc'::text, now())
);

-- Newest RSVPs first when listing.
create index if not exists rsvps_created_at_idx
  on public.rsvps (created_at desc);

-- ── Row Level Security ──────────────────────────────────────
alter table public.rsvps enable row level security;

-- Anyone (anon key) may read the guest book.
drop policy if exists "Allow public read rsvps" on public.rsvps;
create policy "Allow public read rsvps"
  on public.rsvps
  for select
  to anon
  using (true);

-- Anyone (anon key) may add an RSVP — but never update or delete.
-- Same length/enum guards as the table CHECKs are enforced here too.
drop policy if exists "Allow public insert rsvps" on public.rsvps;
create policy "Allow public insert rsvps"
  on public.rsvps
  for insert
  to anon
  with check (
    char_length(guest_name) between 1 and 80
    and attendance_status in ('attending', 'not_attending', 'maybe')
    and (message is null or char_length(message) <= 1000)
  );

-- No UPDATE or DELETE policies exist, so with RLS enabled those operations
-- are denied for the anon role by default.

-- ============================================================
--  Guest list — WhatsApp blast admin (/admin/blast)
-- ============================================================

create table if not exists public.guests (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 120),
  phone      text not null unique check (phone ~ '^62[0-9]{8,13}$'),
  sent       boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists guests_created_at_idx
  on public.guests (created_at asc);

-- ── Row Level Security ──────────────────────────────────────
-- Unlike the public RSVP book, guest names + phone numbers are private, and
-- NEXT_PUBLIC_SUPABASE_ANON_KEY is shipped to every visitor's browser. So
-- RLS is enabled here with NO policies at all: the anon key gets zero access
-- to this table, full stop. The only way in is the service_role key, which
-- never leaves the server (see src/lib/supabaseAdmin.ts, used only by
-- src/app/api/admin/guests/**). service_role bypasses RLS by design, so it
-- needs no policy of its own — and the API routes additionally require a
-- valid admin session cookie (see below) before touching this table at all.
alter table public.guests enable row level security;

-- ============================================================
--  Admin login — username + password for /admin/blast
-- ============================================================

create table if not exists public.admin_users (
  id            uuid primary key default gen_random_uuid(),
  username      text not null unique check (char_length(username) between 3 and 40),
  password_hash text not null,
  created_at    timestamptz not null default timezone('utc'::text, now())
);

-- ── Row Level Security ──────────────────────────────────────
-- Same reasoning as `guests`: RLS enabled with zero policies, so only the
-- service_role key (server-side only, see src/lib/supabaseAdmin.ts) can read
-- it — used solely by src/app/api/admin/login to verify a login attempt.
-- Manage rows with `node scripts/set-admin-user.mjs <username> <password>`
-- rather than by hand; it hashes with the same scrypt scheme
-- src/lib/password.ts verifies against.
alter table public.admin_users enable row level security;
