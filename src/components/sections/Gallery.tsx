"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { config } from "@/lib/config";
import { Photo } from "@/components/ui/Photo";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";

export function Gallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: 3500, stopOnInteraction: false })],
  );
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(true);

  const onSelect = useCallback((api: NonNullable<typeof emblaApi>) => {
    setSelected(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;
    if (playing) autoplay.stop();
    else autoplay.play();
    setPlaying((p) => !p);
  }, [emblaApi, playing]);

  return (
    <section className="relative w-full px-6 py-20">
      <SectionTitle script="Wedding Gallery" />

      <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
        <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex">
            {config.gallery.map((item, i) => (
              <div className="min-w-0 flex-[0_0_80%] px-1.5 sm:flex-[0_0_55%]" key={i}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-ink/10">
                  {item.type === "image" ? (
                    <Photo src={item.src} alt={item.alt} bw className="h-full w-full" />
                  ) : (
                    <video
                      src={item.src}
                      poster={item.poster}
                      controls
                      playsInline
                      className="h-full w-full object-cover photo-bw"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            aria-label="Sebelumnya"
            onClick={() => emblaApi?.scrollPrev()}
            className="rounded-full border border-ink/20 p-2 text-ink/70 transition-colors hover:bg-ink hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            aria-label={playing ? "Jeda slideshow" : "Putar slideshow"}
            onClick={toggleAutoplay}
            className="rounded-full border border-ink/30 p-2.5 text-ink transition-colors hover:bg-ink hover:text-white"
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>

          <button
            aria-label="Berikutnya"
            onClick={() => emblaApi?.scrollNext()}
            className="rounded-full border border-ink/20 p-2 text-ink/70 transition-colors hover:bg-ink hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {config.gallery.map((_, i) => (
            <button
              key={i}
              aria-label={`Ke slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                selected === i ? "w-6 bg-ink" : "w-1.5 bg-ink/25"
              }`}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
