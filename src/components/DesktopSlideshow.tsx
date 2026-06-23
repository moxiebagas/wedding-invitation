"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { config } from "@/lib/config";

const SLIDES = [
  { src: "/images/gallery-1.jpg", alt: "Indri & Rafi" },
  { src: "/images/gallery-2.jpg", alt: "Indri & Rafi" },
  { src: "/images/gallery-3.jpg", alt: "Indri & Rafi" },
  { src: "/images/gallery-4.jpg", alt: "Indri & Rafi" },
  { src: "/images/gallery-5.jpg", alt: "Indri & Rafi" },
  { src: "/images/gallery-6.jpg", alt: "Indri & Rafi" },
  { src: "/images/gallery-7.jpg", alt: "Indri & Rafi" },
  { src: "/images/gallery-8.jpg", alt: "Indri & Rafi" },
];

const INTERVAL_MS = 5000;

export function DesktopSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      {/* Crossfade image slides */}
      <AnimatePresence initial={false}>
        <motion.img
          key={current}
          src={SLIDES[current].src}
          alt={SLIDES[current].alt}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {/* Layered overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

      {/* Centre info — couple names + date */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-col items-center gap-1"
        >
          <span className="font-serif text-[10px] uppercase tracking-[0.45em] text-white/50">
            The Wedding of
          </span>

          <div className="mt-3 flex items-center gap-0">
            <div className="h-px w-10 bg-white/25" />
            <span className="mx-4 font-script text-4xl text-white/25">✦</span>
            <div className="h-px w-10 bg-white/25" />
          </div>

          <h1 className="mt-3 font-script text-7xl leading-tight text-white text-shadow-soft">
            {config.bride.shortName.split(" ")[0]}
          </h1>
          <p className="font-serif text-xl text-white/40">&amp;</p>
          <h1 className="font-script text-7xl leading-tight text-white text-shadow-soft">
            {config.groom.shortName.split(" ")[1] ?? config.groom.shortName.split(" ")[0]}
          </h1>

          <div className="mt-5 h-px w-12 bg-white/30" />

          <p className="mt-4 font-body text-base tracking-[0.25em] text-white/55">
            {config.weddingDateLong}
          </p>
        </motion.div>
      </div>

      {/* Slide progress dots */}
      <div className="absolute bottom-7 left-0 right-0 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Tampilkan foto ${i + 1}`}
            className={`h-[3px] rounded-full transition-all duration-500 ${
              i === current ? "w-7 bg-white" : "w-[7px] bg-white/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
