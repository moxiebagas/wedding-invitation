# Undangan Digital — The Wedding of Indri & Rafi

A digital wedding invitation built with **Next.js (App Router) + TypeScript + Tailwind CSS + Supabase**, following the "Untuk Undangan" Figma design. Dark, elegant theme with scroll animations, a live countdown, Google Maps, Save-to-Calendar, a photo/video gallery slideshow, and an RSVP guest book backed by Supabase.

## Features

| # | Feature | Where |
| - | ------- | ----- |
| 1 | Cover with **dynamic guest name** via `?to=` | `src/app/page.tsx`, `Cover.tsx` |
| 2 | Quran verse opening (QS. Ar-Rum 21) | `Opening.tsx` |
| 3 | The Bride / The Groom profiles (reusable) | `Profile.tsx` |
| 4 | **Countdown** to 30 Aug 2026 | `CountdownTimer.tsx`, `useCountdown.ts` |
| 5 | Akad & Resepsi cards + **Google Maps** embed | `Events.tsx`, `calendar.ts` |
| 6 | **Save to Calendar** (Google + `.ics`) | `Events.tsx`, `calendar.ts` |
| 7 | **Love Story** video | `LoveStory.tsx` |
| 8 | **Gallery** with photos + video + **autoplay slideshow** | `Gallery.tsx` |
| 9 | **RSVP / Doa & Ucapan** stored in Supabase | `Wishes.tsx`, `supabase.ts` |
| 10 | Fade-in / slide-up scroll animations + background music | `Reveal.tsx`, `MusicToggle.tsx` |

Fully responsive (mobile / tablet / desktop) and honours `prefers-reduced-motion`.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure Supabase (already scaffolded in .env.local)
cp .env.local.example .env.local   # then fill in your values
#   NEXT_PUBLIC_SUPABASE_URL=...
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 3. Create the RSVP table — run supabase/schema.sql in the
#    Supabase dashboard → SQL Editor (see below)

# 4. Run
npm run dev      # http://localhost:3000
npm run build    # production build
```

### Set up the database

The RSVP / guest book needs one table. In the Supabase dashboard open
**SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql),
and **Run**. It creates the `wishes` table and Row-Level-Security policies that
allow the public to *read* and *insert* wishes (never update or delete).

### Personalise

All copy, names, dates, parents, events, gallery items and links live in a
single file: **`src/lib/config.ts`**. Edit it — no component changes needed.

### Add real photos / video

Drop files into `public/images/` using the names in `config.ts`
(`cover.jpg`, `bride.jpg`, `groom.jpg`, `gallery-1.jpg`…, `clip-1.mp4`) and
background music at `public/audio/backsound.mp3`. Until then the app shows an
elegant gradient placeholder, so nothing looks broken.

### Dynamic guest name

Share a personalised link with the `to` query parameter:

```
https://your-domain.com/?to=Keluarga%20Bapak%20Andi
```

If `to` is omitted it falls back to **"Tamu Undangan"** (configurable in `config.ts`).

## Project structure

```
src/
  app/
    layout.tsx           Fonts (Playfair, Cormorant, Great Vibes) + metadata
    page.tsx             Reads ?to= and renders the invitation
    globals.css          Theme tokens, helpers, reduced-motion
  components/
    Invitation.tsx       Cover ↔ full-invite state + scroll lock + music
    CountdownTimer.tsx
    MusicToggle.tsx
    sections/            Cover, Opening, Profile, Events, LoveStory, Gallery, Wishes, Footer
    ui/                  Reveal (scroll animation), SectionTitle, Photo (graceful fallback)
  hooks/useCountdown.ts
  lib/                   config, supabase, calendar, utils
supabase/schema.sql      RSVP table + RLS policies
```

## Tech stack

- **Next.js 15** (App Router, RSC) + **TypeScript**
- **Tailwind CSS** + `tailwindcss-animate`
- **framer-motion** — scroll reveals & transitions
- **embla-carousel** + autoplay — gallery slideshow
- **@supabase/supabase-js** — RSVP storage
- **lucide-react** — icons
