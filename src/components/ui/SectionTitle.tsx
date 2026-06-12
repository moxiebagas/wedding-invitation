import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionTitleProps {
  /** Small serif word rendered in caps, e.g. "WEDDING". */
  overline?: string;
  /** The flowing script word, e.g. "Event" or "Love Story". */
  script: string;
  className?: string;
}

/**
 * The recurring section heading: an uppercase serif word stacked with a
 * large graphite script word and a thin divider.
 */
export function SectionTitle({ overline, script, className }: SectionTitleProps) {
  return (
    <Reveal className={cn("text-center", className)}>
      {overline && (
        <p className="font-serif text-sm uppercase tracking-[0.45em] text-ash sm:text-base">
          {overline}
        </p>
      )}
      <h2 className="-mt-1 font-script text-5xl leading-tight text-graphite sm:text-6xl">
        {script}
      </h2>
      <span className="rule-divider mt-3" />
    </Reveal>
  );
}
