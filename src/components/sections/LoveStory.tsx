"use client";

import { useRef, useState } from "react";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function LoveStory() {
  const [isStoryVisible, setIsStoryVisible] = useState(false);
  const storyRef = useRef<HTMLDivElement>(null);
  const points = config.story.points;

  function revealStory() {
    setIsStoryVisible(true);
    // Smoothly bring the revealed story into view.
    window.setTimeout(
      () => storyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }),
      350,
    );
  }

  return (
    <section className="relative w-full px-5 pb-10 pt-20 sm:px-6">
      <Reveal blur className="mx-auto w-full max-w-xl">
        <div className="rounded-[28px] border border-white/40 p-5 sm:p-7">
          <h2 className="text-center font-script text-4xl text-white sm:text-5xl">
            Love Story
          </h2>

          {/* Video — self-hosted .mp4 (autoplay, muted, looping, inline for mobile) */}
          {/* <div className="mt-5 overflow-hidden rounded-2xl shadow-xl">
            <video
              src={config.story.video}
              autoPlay
              muted
              loop
              playsInline
              className="aspect-video w-full bg-black object-cover"
            />
          </div> */}

          {/* Story timeline + backdrop-blur reveal overlay */}
          <div ref={storyRef} className="relative mt-6">
            <div
              className={cn(
                "no-scrollbar relative max-h-[300px] rounded-2xl transition-shadow duration-700 sm:max-h-[520px]",
                isStoryVisible
                  ? "overflow-y-auto shadow-[0_0_45px_-12px_rgba(255,255,255,0.35)]"
                  : "overflow-hidden",
              )}
            >
              <ol
                className={cn(
                  "space-y-6 pr-1 transition-transform duration-700 ease-out",
                  !isStoryVisible && "scale-[0.99]",
                )}
              >
                {points.map((p, i) => (
                  <li key={p.title} className="relative pl-11">
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
            </div>

            {/* Backdrop-blur overlay + centered "See Story" — fades out on reveal */}
            <div
              className={cn(
                "absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/20 backdrop-blur-sm transition-opacity duration-700 ease-out",
                isStoryVisible ? "pointer-events-none opacity-0" : "opacity-100",
              )}
            >
              <button
                type="button"
                onClick={revealStory}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-black/40 px-6 py-2.5 font-body text-sm text-white backdrop-blur transition-[transform,background,color] duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-ink"
              >
                See Story
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
