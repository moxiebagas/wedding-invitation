"use client";

import { CalendarDays, CalendarPlus, Clock, MapPin } from "lucide-react";
import { config, type EventDetail } from "@/lib/config";
import { mapsDirectionsUrl } from "@/lib/calendar";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";

// New full-bleed backdrop for this slide (couple reading). Photo degrades
// gracefully until the file is dropped into public/images.
const EVENT_BG = "/images/bg-event.jpg";

/* ── Device-calendar (.ics) — same approach as Opening.tsx, no Google login ── */

/** ISO string → iCalendar UTC stamp, e.g. "…+07:00" → "20260830T020000Z". */
function toICSDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
}

/** Escape iCalendar TEXT values (backslash, comma, semicolon, newline). */
function escapeICS(value: string): string {
  return value.replace(/([\\,;])/g, "\\$1").replace(/\n/g, "\\n");
}

/** Build a standards-compliant .ics for a single wedding event. */
function buildEventICS(event: EventDetail): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Undangan Indri & Rafi//Wedding//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.title.toLowerCase().replace(/\s+/g, "-")}-indri-rafi@undangan`,
    `DTSTAMP:${toICSDate(new Date().toISOString())}`,
    `DTSTART:${toICSDate(event.start)}`,
    `DTEND:${toICSDate(event.end)}`,
    `SUMMARY:${escapeICS(`${event.title} — Indri & Rafi`)}`,
    `LOCATION:${escapeICS(`${event.venue}, ${event.address}`)}`,
    `DESCRIPTION:${escapeICS(`Undangan pernikahan Indri & Rafi — ${event.title}.`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Generate the .ics on the fly and hand it to the device calendar. */
function saveEventToCalendar(event: EventDetail): void {
  const blob = new Blob([buildEventICS(event)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/\s+/g, "-")}-Indri-Rafi.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* ── Cards ──────────────────────────────────────────────────────────────── */

function EventCard({ event, delay }: { event: EventDetail; delay: number }) {
  return (
    <Reveal direction="up" delay={delay} className="w-full max-w-sm">
      <div className="rounded-3xl bg-paper px-6 py-7 text-center shadow-[0_26px_60px_-28px_rgba(0,0,0,0.75)]">
        {/* Icon badge */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 bg-mist text-ink">
          <CalendarDays className="h-5 w-5" />
        </div>

        <h3 className="mt-3 font-script text-4xl leading-none text-graphite">
          {event.title}
        </h3>

        <p className="mt-3 font-body text-base text-ink">{event.dateLabel}</p>

        {/* Time — its own centered row */}
        <p className="mt-1 flex items-center justify-center gap-1.5 font-body text-sm text-ash">
          <Clock className="h-4 w-4 text-ink" />
          {event.timeLabel}
        </p>

        {/* Location — centered icon image, then the venue name on a new line */}
        <div className="mt-3 flex flex-col items-center gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/icon-location.png" alt="Lokasi" className="h-6 w-6 object-contain" />
          <p className="font-serif text-base text-ink">{event.venue}</p>
          <p className="font-body text-sm text-ash">{event.address}</p>
        </div>

        {/* Actions: Maps (location) + Save to device calendar (.ics) */}
        <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <a
            href={mapsDirectionsUrl(`${event.venue} ${event.address}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 font-body text-sm font-medium text-paper transition-transform hover:scale-[1.03] sm:w-auto"
          >
            <MapPin className="h-4 w-4" />
            Lihat Lokasi
          </a>
          <button
            type="button"
            onClick={() => saveEventToCalendar(event)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-ink px-4 py-2.5 font-body text-sm text-ink transition-colors hover:bg-ink hover:text-paper sm:w-auto"
          >
            <CalendarPlus className="h-4 w-4" />
            Save to Calendar
          </button>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Slide ──────────────────────────────────────────────────────────────── */

export function Events() {
  return (
    <section
      id="acara"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-ink py-16"
    >
      {/* Full-cover backdrop + heavy legibility overlay (SVG: 60% black) */}
      <Photo
        src={EVENT_BG}
        alt={`${config.bride.name} & ${config.groom.name}`}
        priority
        className="absolute inset-0 h-full w-full"
        imgClassName="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full px-6">
        {/* Title */}
        <Reveal className="text-center">
          <p className="font-serif text-sm uppercase tracking-[0.45em] text-white/75 sm:text-base">
            The Wedding Day
          </p>
          <h2 className="font-script text-5xl leading-tight text-white sm:text-6xl">
            Event
          </h2>
        </Reveal>

        {/* Countdown */}
        <Reveal delay={0.1} className="mx-auto mt-6 max-w-sm">
          <CountdownTimer target={config.weddingDate} />
        </Reveal>

        {/* Event cards */}
        <div className="mt-10 flex flex-col items-center gap-6">
          {config.events.map((event, i) => (
            <EventCard key={event.title} event={event} delay={0.15 + i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
