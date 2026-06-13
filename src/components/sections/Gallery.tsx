"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";

// Gallery photos — add more by appending image paths to this array.
const galleryImages: string[] = [
  "/images/gallery-1.png",
  "/images/gallery-2.png",
  "/images/gallery-3.png",
];

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
    <section className="relative w-full px-6 pb-24 pt-6">
      <Reveal className="text-center">
        <h2 className="font-script text-4xl leading-tight text-white sm:text-5xl">
          Wedding Gallery
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-8 max-w-3xl">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {galleryImages.map((src, i) => (
              <div className="min-w-0 flex-[0_0_72%] px-2 sm:flex-[0_0_48%]" key={src}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-white/80 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]">
                  <Photo src={src} alt={`Galeri pernikahan ${i + 1}`} className="h-full w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            aria-label="Sebelumnya"
            onClick={() => emblaApi?.scrollPrev()}
            className="rounded-full border border-white/40 p-2 text-white/80 transition-colors hover:bg-white hover:text-ink"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            aria-label={playing ? "Jeda slideshow" : "Putar slideshow"}
            onClick={toggleAutoplay}
            className="rounded-full border border-white/60 p-2.5 text-white transition-colors hover:bg-white hover:text-ink"
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>

          <button
            aria-label="Berikutnya"
            onClick={() => emblaApi?.scrollNext()}
            className="rounded-full border border-white/40 p-2 text-white/80 transition-colors hover:bg-white hover:text-ink"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {galleryImages.map((src, i) => (
            <button
              key={src}
              aria-label={`Ke slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                selected === i ? "w-6 bg-white" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
