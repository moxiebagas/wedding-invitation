import { Instagram } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

interface Person {
  name: string;
  shortName: string;
  order: string;
  parents: string;
  instagram: string;
  photo: string;
}

interface ProfileProps {
  person: Person;
  /** Vertical word stamped over the photo, e.g. "The BRIDE". */
  label: string;
  /** "left" mirrors the layout for the groom. */
  side?: "left" | "right";
}

export function Profile({ person, label, side = "right" }: ProfileProps) {
  return (
    <section className="relative mx-auto w-full max-w-md px-6 py-14">
      <Reveal direction={side === "right" ? "right" : "left"}>
        <div className="relative">
          <Photo
            src={person.photo}
            alt={person.name}
            kenBurns
            bw
            className="aspect-[3/4] w-full rounded-2xl border border-ink/10"
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/55 via-transparent to-black/10" />

          {/* Vertical engraved label */}
          <span
            className={cn(
              "writing-vertical absolute top-6 font-serif text-3xl uppercase tracking-[0.2em] text-white/90 text-shadow-soft sm:text-4xl",
              side === "right" ? "left-4" : "right-4",
            )}
          >
            {label}
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-6 text-center">
        <h3 className="font-script text-4xl text-graphite sm:text-5xl">{person.shortName}</h3>

        <a
          href={`https://instagram.com/${person.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-4 py-1.5 font-body text-sm text-ink transition-colors hover:bg-ink hover:text-white"
        >
          <Instagram className="h-4 w-4" />@{person.instagram}
        </a>

        <p className="mt-5 font-body text-base text-ash">{person.order}</p>
        <p className="font-body text-lg text-ink">{person.parents}</p>
      </Reveal>
    </section>
  );
}
