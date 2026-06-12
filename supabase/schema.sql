-- ============================================================
--  Digital Wedding Invitation — RSVP / "Doa & Ucapan" schema
--  Run this in the Supabase SQL Editor (Dashboard → SQL Editor).
-- ============================================================

create table if not exists public.wishes (
  id          uuid primary key default gen_random_uuid(),
  guest_name  text not null check (char_length(guest_name) between 1 and 80),
  attendance  text not null check (attendance in ('hadir', 'tidak_hadir', 'ragu')),
  message     text not null check (char_length(message) between 1 and 1000),
  created_at  timestamptz not null default now()
);

-- Newest wishes first when listing.
create index if not exists wishes_created_at_idx
  on public.wishes (created_at desc);

-- ── Row Level Security ──────────────────────────────────────
alter table public.wishes enable row level security;

-- Anyone (anon key) may read the guest book.
drop policy if exists "Public can read wishes" on public.wishes;
create policy "Public can read wishes"
  on public.wishes
  for select
  using (true);

-- Anyone (anon key) may add a wish — but never update or delete.
drop policy if exists "Public can insert wishes" on public.wishes;
create policy "Public can insert wishes"
  on public.wishes
  for insert
  with check (
    char_length(guest_name) between 1 and 80
    and char_length(message) between 1 and 1000
    and attendance in ('hadir', 'tidak_hadir', 'ragu')
  );
