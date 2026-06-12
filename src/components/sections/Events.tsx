"use client";

import { CalendarPlus, Clock, MapPin } from "lucide-react";
import { config, type EventDetail } from "@/lib/config";
import {
  googleCalendarUrl,
  icsDataUrl,
  mapsDirectionsUrl,
  mapsEmbedUrl,
} from "@/lib/calendar";
import { CountdownTimer } from "@/components/CountdownTimer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";

function EventCard({ event, delay }: { event: EventDetail; delay: number }) {
  return (
    <Reveal delay={delay} className="paper-card w-full max-w-md p-6 text-center sm:p-8">
      <h3 className="font-script text-4xl text-graphite">{event.title}</h3>
      <span className="rule-divider my-4" />

      <p className="font-body text-lg text-ink">{event.dateLabel}</p>

      <p className="mt-3 inline-flex items-center gap-2 font-body text-base text-ash">
        <Clock className="h-4 w-4 text-ink" />
        {event.timeLabel}
      </p>

      <p className="mt-3 inline-flex items-center justify-center gap-2 font-serif text-lg text-ink">
        <MapPin className="h-4 w-4 text-ink" />
        {event.venue}
      </p>
      <p className="font-body text-base text-ash">{event.address}</p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <a
          href={mapsDirectionsUrl(`${event.venue} ${event.address}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 font-body text-base font-medium text-white transition-transform hover:scale-[1.03]"
        >
          <MapPin className="h-4 w-4" />
          Google Maps
        </a>
        <a
          href={googleCalendarUrl(event, config.location.query)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/25 px-5 py-2.5 font-body text-base text-ink transition-colors hover:bg-ink hover:text-white"
        >
          <CalendarPlus className="h-4 w-4" />
          Save the Date
        </a>
      </div>

      <a
        href={icsDataUrl(event)}
        download={`${event.title.replace(/\s+/g, "-")}-Indri-Rafi.ics`}
        className="mt-3 inline-block font-body text-sm text-ash underline-offset-4 hover:text-ink hover:underline"
      >
        Unduh untuk Apple / Outlook (.ics)
      </a>
    </Reveal>
  );
}

export function Events() {
  return (
    <section id="acara" className="relative w-full bg-mist px-6 py-20">
      <SectionTitle overline="WEDDING" script="Event" />

      <Reveal className="mt-10">
        <p className="text-center font-body text-base text-ash">Menuju hari bahagia</p>
        <div className="mt-4">
          <CountdownTimer target={config.weddingDate} />
        </div>
      </Reveal>

      <div className="mt-12 flex flex-col items-center gap-8">
        {config.events.map((event, i) => (
          <EventCard key={event.title} event={event} delay={i * 0.1} />
        ))}
      </div>

      {/* Embedded map */}
      <Reveal className="mx-auto mt-12 w-full max-w-2xl">
        <div className="paper-card overflow-hidden p-1.5">
          <iframe
            title={`Lokasi ${config.location.name}`}
            src={mapsEmbedUrl(config.location.query)}
            className="h-64 w-full rounded-xl border-0 sm:h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <p className="mt-3 text-center font-serif text-lg text-ink">{config.location.name}</p>
      </Reveal>
    </section>
  );
}
