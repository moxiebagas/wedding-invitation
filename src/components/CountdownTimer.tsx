"use client";

import { useCountdown } from "@/hooks/useCountdown";

const labels: { key: "days" | "hours" | "minutes" | "seconds"; label: string }[] = [
  { key: "days", label: "Hari" },
  { key: "hours", label: "Jam" },
  { key: "minutes", label: "Menit" },
  { key: "seconds", label: "Detik" },
];

export function CountdownTimer({ target }: { target: string }) {
  const c = useCountdown(target);

  return (
    <div className="mx-auto flex max-w-sm items-stretch justify-center gap-2 sm:gap-3">
      {labels.map(({ key, label }) => (
        <div
          key={key}
          className="paper-card flex flex-1 flex-col items-center px-2 py-3 sm:px-3 sm:py-4"
        >
          <span className="font-serif text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
            {String(c[key]).padStart(2, "0")}
          </span>
          <span className="mt-1 font-body text-xs uppercase tracking-widest text-ash">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
