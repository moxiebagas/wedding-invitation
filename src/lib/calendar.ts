import type { EventDetail } from "./config";

/** Convert an ISO string to the compact UTC form used by calendar links. */
function toCalendarUTC(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
}

/** Build a "Add to Google Calendar" URL for an event. */
export function googleCalendarUrl(event: EventDetail, locationQuery: string): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} — Indri & Rafi`,
    dates: `${toCalendarUTC(event.start)}/${toCalendarUTC(event.end)}`,
    details: `Undangan pernikahan Indri Anjari & Muhammad Rafi Herman — ${event.title}.`,
    location: `${event.venue}, ${event.address}`,
    ctz: "Asia/Jakarta",
  });
  // Encode the maps query as well so the location is tappable.
  void locationQuery;
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Build a downloadable .ics file (Apple Calendar / Outlook) as a data URL. */
export function icsDataUrl(event: EventDetail): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Undangan Indri & Rafi//ID",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.title.replace(/\s+/g, "-").toLowerCase()}-indri-rafi@undangan`,
    `DTSTAMP:${toCalendarUTC(new Date().toISOString())}`,
    `DTSTART:${toCalendarUTC(event.start)}`,
    `DTEND:${toCalendarUTC(event.end)}`,
    `SUMMARY:${event.title} — Indri & Rafi`,
    `DESCRIPTION:Undangan pernikahan Indri Anjari & Muhammad Rafi Herman.`,
    `LOCATION:${event.venue}\\, ${event.address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}

/** Google Maps embed URL (no API key required). */
export function mapsEmbedUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

/** Google Maps directions / open URL. */
export function mapsDirectionsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
