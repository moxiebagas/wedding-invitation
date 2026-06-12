"use client";

import { useCountdown } from "@/hooks/useCountdown";

// Labels use the singular base word; the trailing "s" is added by pluralize().
const labels: { key: "days" | "hours" | "minutes" | "seconds"; label: string }[] = [
  { key: "days", label: "day" },
  { key: "hours", label: "hour" },
  { key: "minutes", label: "minute" },
  { key: "seconds", label: "second" },
];

/** Append "s" only when the count is not exactly 1 (e.g. 1 day, 2 days, 0 days). */
function pluralize(count: number, word: string): string {
  return count === 1 ? word : `${word}s`;
}

export function CountdownTimer({ target }: { target: string }) {
  const c = useCountdown(target);

  return (
    <div className="mx-auto flex max-w-sm items-stretch justify-center gap-2 sm:gap-3">
      {labels.map(({ key, label }) => (
        <div
          key={key}
          className="flex flex-1 flex-col items-center rounded-2xl"
        >
          <span className="font-serif text-3xl font-semibold leading-none tabular-nums text-white sm:text-4xl">
            {String(c[key]).padStart(2, "0")}
          </span>
          <span className="mt-2 font-body text-[0.6rem] uppercase tracking-[0.25em] text-white/70 sm:text-[0.65rem]">
            {pluralize(c[key], label)}
          </span>
        </div>
      ))}
    </div>
  );
}
