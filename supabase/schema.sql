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
