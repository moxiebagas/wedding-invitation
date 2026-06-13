"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function LoveStory() {
  const [expanded, setExpanded] = useState(false);
  const [shimmer, setShimmer] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState(180);
  const firstPointRef = useRef<HTMLLIElement>(null);
  const points = config.story.points;

  // Match the collapsed height to story point #1 (+ a small blurred peek of #2),
  // re-measuring on resize so it stays accurate across breakpoints.
  useEffect(() => {
    const measure = () => {
      const el = firstPointRef.current;
      if (el) setCollapsedHeight(el.offsetHeight + 56);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [points.length]);

  function handleToggle() {
    const next = !expanded;
    setExpanded(next);
    if (next) {
      // One-shot shimmer/sparkle that runs only after opening.
      setShimmer(true);
      window.setTimeout(() => setShimmer(false), 1200);
    }
  }

  return (
    <section className="relative w-full px-5 pb-10 pt-20 sm:px-6">
      <Reveal className="mx-auto w-full max-w-xl">
        <div className="rounded-[28px] border border-white/40 p-5 sm:p-7">
          <h2 className="text-center font-script text-4xl text-white sm:text-5xl">
            Love Story
          </h2>

          {/* Video */}
          <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="aspect-video w-full">
              <iframe
                title="Love story video"
                src={config.story.videoUrl}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Story timeline.
              The blur veil + Show More live INSIDE this single wrapper. Collapsed
              height = point #1; expanded becomes a scrollable, fixed-height area. */}
          <div className="mt-6">
            <div
              style={expanded ? undefined : { maxHeight: `${collapsedHeight}px` }}
              className={cn(
                "no-scrollbar relative overflow-hidden rounded-2xl transition-[max-height,box-shadow] duration-700 ease-in-out",
                "max-h-[420px] sm:max-h-[520px]",
                expanded && "overflow-y-auto shadow-[0_0_45px_-12px_rgba(255,255,255,0.35)]",
              )}
            >
              <ol className="space-y-6 pr-1">
                {points.map((p, i) => (
                  <li
                    key={p.title}
                    ref={i === 0 ? firstPointRef : undefined}
                    className="relative pl-11"
                  >
                    {/* connector line between points */}
                    {i < points.length - 1 && (
                      <span className="absolute left-[13px] top-7 h-[calc(100%+1.5rem)] w-px bg-white/30" />
                    )}
                    {/* number badge */}
                    <span className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-black/40 font-body text-xs text-white">
                      {i + 1}
                    </span>

                    <h3 className="font-body text-base font-semibold text-white">
                      {p.emoji} {p.title}
                    </h3>
                    <p className="mt-1.5 font-body text-sm leading-relaxed text-white/80">
                      {p.text}
                    </p>
                  </li>
                ))}
              </ol>

              {/* One-shot white shimmer sweeping across after opening */}
              {shimmer && (
                <motion.div
                  initial={{ x: "-130%" }}
                  animate={{ x: "230%" }}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                  className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                />
              )}

              {/* Blur/fade veil + centered Show More — fades out when expanded.
                  pointer-events-none lets scroll pass; the button re-enables itself. */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-center justify-center",
                  "bg-gradient-to-t from-black/90 via-black/45 to-transparent backdrop-blur-[1.5px]",
                  "transition-opacity duration-500 ease-out",
                  expanded ? "opacity-0" : "opacity-100",
                )}
              >
                {!expanded && (
                  <button
                    type="button"
                    onClick={handleToggle}
                    className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-black/30 px-5 py-2 font-body text-sm text-white backdrop-blur transition-colors hover:bg-white hover:text-ink"
                  >
                    Show More
                    <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                  </button>
                )}
              </div>
            </div>

            {/* Show Less once expanded */}
            {expanded && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleToggle}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/40 px-5 py-2 font-body text-sm text-white transition-colors hover:bg-white hover:text-ink"
                >
                  Show Less
                  <ChevronDown className="h-4 w-4 rotate-180 transition-transform duration-300" />
                </button>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
