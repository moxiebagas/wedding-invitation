"use client";

import { CalendarPlus } from "lucide-react";
import { config } from "@/lib/config";
import { InvitationSection } from "@/components/ui/InvitationSection";

/** ISO string → iCalendar UTC stamp, e.g. "2026-08-30T09:00:00+07:00" → "20260830T020000Z". */
function toICSDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
}

/** Escape iCalendar TEXT values (backslash, comma, semicolon, newline). */
function escapeICS(value: string): string {
  return value.replace(/([\\,;])/g, "\\$1").replace(/\n/g, "\\n");
}

/**
 * Build a standards-compliant .ics for the wedding so guests can save it to
 * their device calendar (no Google login / no redirect). Times come from the
 * config and are emitted in UTC (Z), which every calendar app localises.
 */
function buildWeddingICS(): string {
  const start = config.weddingDate;
  const end = config.events[config.events.length - 1].end;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Undangan Indri & Rafi//Wedding//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:wedding-indri-rafi-20260830@undangan",
    `DTSTAMP:${toICSDate(new Date().toISOString())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    "SUMMARY:Wedding Invitation",
    `LOCATION:${escapeICS(config.location.name)}`,
    "DESCRIPTION:Wedding invitation event",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function Opening() {
  /** Generate the .ics on the fly and hand it to the device calendar. */
  function handleSaveCalendar() {
    const blob = new Blob([buildWeddingICS()], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "undangan-indri-rafi.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  return (
    <InvitationSection
      backgroundImage={config.openingPhoto}
      overlayClassName="bg-black/[0.12]"
      className="flex min-h-[100svh] flex-col bg-mist"
      contentClassName="flex flex-1 flex-col"
      contentDelay={0.25}
    >
      {/* ── Title block + Save-to-Calendar ───────────────────── */}
      <div className="px-6 pt-12 text-center sm:pt-16">
        <p className="font-serif text-sm text-ink/80 sm:text-base">The Wedding Of</p>

        <h2 className="mt-2 whitespace-nowrap font-serif text-[clamp(1.5rem,6.5vw,3rem)] font-bold leading-[1.15] text-ink">
          {config.bride.name}{" "}
          <span className="font-script text-[1.1em] font-normal italic">&amp;</span>
          <br />
          {config.groom.name}
        </h2>

        <p className="mt-3 font-body text-base text-ink/80 sm:text-lg">
          {config.weddingDateLong}
        </p>

        <button
          type="button"
          onClick={handleSaveCalendar}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink/40 bg-paper/50 px-5 py-2 font-body text-sm text-ink backdrop-blur transition-[transform,background,color] duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-paper sm:text-base"
        >
          <CalendarPlus className="h-4 w-4" />
          <span className="leading-none">Save to Calendar</span>
        </button>
      </div>

      {/* Couple photo fills this flexible middle area. */}
      <div className="flex-1" />

      {/* ── Opening verse card ───────────────────────────────── */}
      <div className="px-4 pb-7 sm:pb-9">
        <div className="mx-auto max-w-md rounded-[26px] bg-[#cccdcf]/85 px-6 py-7 text-center shadow-[0_18px_50px_-24px_rgba(20,20,20,0.45)] backdrop-blur-sm sm:px-8">
          <p dir="rtl" lang="ar" className="text-lg text-ink sm:text-xl">
            {config.verse.arabic}
          </p>
          <p className="mt-2 font-body text-sm font-medium text-ink/85 sm:text-base">
            {config.verse.translation}
          </p>
          <p className="mt-2 font-body text-sm font-semibold text-ink/70">
            {config.verse.source}
          </p>
        </div>
      </div>
    </InvitationSection>
  );
}
