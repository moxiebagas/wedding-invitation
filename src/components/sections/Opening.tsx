import { CalendarPlus } from "lucide-react";
import { config } from "@/lib/config";
import { weddingGoogleCalendarUrl } from "@/lib/calendar";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";

export function Opening() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-mist via-paper to-mist px-6 pt-16 pb-20">
      {/* ── Title block ──────────────────────────────────────── */}
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="font-serif text-sm text-ash sm:text-base">The Wedding Of</p>

        <h2 className="mt-2 font-serif text-3xl font-bold leading-[1.15] text-ink sm:text-5xl">
          {config.bride.name}{" "}
          <span className="font-script text-[1.1em] font-normal italic">&amp;</span>
          <br />
          {config.groom.name}
        </h2>

        <p className="mt-3 font-body text-base text-ash sm:text-lg">
          {config.weddingDateLong}
        </p>

        <a
          href={weddingGoogleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink/25 bg-paper/70 px-5 py-2 font-body text-sm text-ink backdrop-blur transition-colors hover:bg-ink hover:text-paper sm:text-base"
        >
          <CalendarPlus className="h-4 w-4" />
          <span className="leading-none">Save Google Calendar</span>
        </a>
      </Reveal>

      {/* ── Couple photo (blends into the light backdrop) ─────── */}
      <Reveal delay={0.1} className="mt-10">
        <Photo
          src={config.openingPhoto}
          alt={`${config.bride.name} & ${config.groom.name}`}
          priority
          className="mx-auto aspect-[780/1542] w-full max-w-md bg-transparent"
          imgClassName="object-contain object-bottom"
        />
        {/* Soft fade so the photo melts into the verse card below. */}
        <div className="pointer-events-none -mt-20 h-20 w-full bg-gradient-to-t from-mist to-transparent" />
      </Reveal>

      {/* ── Opening verse ────────────────────────────────────── */}
      <Reveal delay={0.15} className="mx-auto -mt-6 max-w-xl">
        <div className="paper-card px-6 py-8 text-center sm:px-9 sm:py-10">
          <p
            dir="rtl"
            lang="ar"
            className="text-xl leading-[2.5rem] text-ink sm:text-2xl sm:leading-[3rem]"
          >
            {config.verse.arabic}
          </p>
          <p className="mt-6 font-body text-base leading-relaxed text-ash sm:text-lg">
            {config.verse.translation}
          </p>
          <p className="mt-3 font-serif text-sm tracking-[0.2em] text-ink/70">
            {config.verse.source}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
