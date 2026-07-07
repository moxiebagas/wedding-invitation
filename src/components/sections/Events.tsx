"use client";

import { CalendarDays, CalendarPlus, Clock, MapPin } from "lucide-react";
import { config, type EventDetail } from "@/lib/config";
import { mapsDirectionsUrl } from "@/lib/calendar";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ParallaxBg } from "@/components/ui/ParallaxBg";
import { Reveal } from "@/components/ui/Reveal";

// Full-bleed backdrop for this slide (couple reading).
const EVENT_BG = "/images/bg-event.png";

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
      <div className="rounded-3xl border border-white/20 bg-white/10 px-6 py-7 text-center shadow-[0_26px_60px_-28px_rgba(0,0,0,0.75)] backdrop-blur-md">
        {/* Icon badge */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/40 text-white">
          <CalendarDays className="h-5 w-5" />
        </div>

        <h3 className="mt-3 font-script text-4xl leading-none text-white">
          {event.title}
        </h3>

        <p className="mt-3 font-body text-base text-white/90">{event.dateLabel}</p>

        {/* Time — its own centered row */}
        <p className="mt-1 flex items-center justify-center gap-1.5 font-body text-sm text-white/70">
          <Clock className="h-4 w-4 text-white" />
          {event.timeLabel}
        </p>

        {/* Location — centered icon image, then the venue name on a new line */}
        <div className="mt-3 flex flex-col items-center gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/icon-location.png"
            alt="Lokasi"
            className="h-6 w-6 object-contain brightness-0 invert"
          />
          <p className="font-serif text-base text-white">{event.venue}</p>
          <p className="font-body text-sm text-white/70">{event.address}</p>
        </div>

        {/* Actions: Maps (location) + Save to device calendar (.ics) */}
        <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <a
            href={mapsDirectionsUrl(`${event.venue} ${event.address}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-paper px-4 py-2.5 font-body text-sm font-medium text-ink transition-[transform,background,color] duration-300 hover:-translate-y-0.5 hover:bg-mist sm:w-auto"
          >
            <MapPin className="h-4 w-4" />
            Lihat Lokasi
          </a>
          {/* <button
            type="button"
            onClick={() => saveEventToCalendar(event)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-ink px-4 py-2.5 font-body text-sm text-ink transition-[transform,background,color] duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-paper sm:w-auto"
          >
            <CalendarPlus className="h-4 w-4" />
            Save to Calendar
          </button> */}
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
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-clip bg-ink py-16"
    >
      {/* Full-cover backdrop (scroll fade + parallax) + 60% legibility overlay */}
      <ParallaxBg src={EVENT_BG} overlayClassName="bg-black/60" />

      <div className="relative z-10 w-full px-6">
        {/* Title */}
        <Reveal className="text-center">
          <h2 className="font-script text-5xl leading-tight text-white sm:text-6xl">
            Wedding Event
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
