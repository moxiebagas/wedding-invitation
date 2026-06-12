# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # next lint (ESLint)
```

There is no test suite. Verify changes by running `npm run dev` and inspecting in the browser (try `?to=Some%20Name` for the guest-name path).

## Environment

Supabase credentials live in `.env.local` (copy from `.env.local.example`):
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The app degrades
gracefully without them — `isSupabaseConfigured` gates the RSVP section, so the
rest of the invitation renders fine with no env vars set.

The RSVP feature needs the `wishes` table. Run `supabase/schema.sql` in the
Supabase dashboard's SQL Editor. RLS allows public SELECT + INSERT only (never
update/delete); the same length/enum constraints are enforced both in the table
`check` and the INSERT policy `with check`.

## Architecture

A single-page Next.js 15 (App Router, React 19) digital wedding invitation in
Indonesian. The content is data-driven and the runtime is almost entirely client
components.

**Single source of content — `src/lib/config.ts`.** Every piece of copy, names,
dates, parents, events, gallery items, verse, and media paths live in the exported
`config` object (typed `as const`). Sections read from it; there is no hard-coded
text in components. Personalising the invitation means editing this file only —
prefer changing config over touching components.

**Two-state flow orchestrated by `src/components/Invitation.tsx`.** The page has
two states: (1) the **Cover** with body scroll locked, and (2) the full scrollable
invitation revealed after the guest taps "Open Invitation", at which point
background music starts. `Invitation` owns the `opened` state, the scroll lock, the
section order, and the `MusicToggle`. To add/reorder a section, edit the JSX list
here.

**Server → client boundary.** `src/app/page.tsx` is the only server component of
note: it awaits `searchParams`, reads the `?to=` guest name (falling back to
`config.defaultGuest`), and passes it into the client `Invitation`. The guest name
flows down to both the Cover and the RSVP form's default name. Almost everything
else is `"use client"` (framer-motion, embla, Supabase, hooks all need the client).

**Sections** (`src/components/sections/`) are the vertical blocks rendered in order:
Cover, Opening (Quran verse), Profile (rendered twice — bride then groom, via a
`person`/`side` prop), Events, LoveStory, Gallery, Wishes (RSVP), Footer.

**Shared UI** (`src/components/ui/`):
- `Reveal` — wraps a block in a framer-motion fade+slide-in-on-scroll (`whileInView`, `once: true`). Use this for scroll animations rather than re-rolling motion variants.
- `Photo` — `<img>` with graceful fallback: on load error it swaps to a neutral gradient + "I & R" monogram, so missing media never breaks layout. Supports `kenBurns` and `bw` (grayscale) treatments. Real media goes in `public/images/` and `public/audio/` using the filenames referenced in `config.ts`.
- `SectionTitle` — consistent heading treatment.

**Other lib:** `calendar.ts` builds Google Calendar links and `.ics` files from an
`EventDetail` (note events carry ISO-8601-with-offset `start`/`end` for this).
`supabase.ts` exports the browser client plus the `Wish`/`Attendance` types and
`attendanceLabel` map. `useCountdown.ts` drives the countdown to `weddingDate`.

## Styling conventions

- Tailwind with a custom **monochrome palette** (`ink`, `graphite`, `ash`, `mist`, `paper`) and three Google-font families wired as CSS variables in `layout.tsx`: `font-serif` (Playfair), `font-body` (Cormorant), `font-script` (Great Vibes). Use these tokens, not raw hex/font names.
- Custom keyframes/animations (`ken-burns`, `float`, `shimmer`, `fade-in`, `slide-up`) are defined in `tailwind.config.ts`.
- Animations honour `prefers-reduced-motion` (handled in `globals.css`).
- Use the `cn()` helper from `src/lib/utils.ts` (clsx + tailwind-merge) for conditional classes.
- The invitation is centered in a `max-w-3xl` column (mobile-first, looks like a tall card on desktop).
