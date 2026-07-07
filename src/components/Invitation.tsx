"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Contact } from "lucide-react";
import { config } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Cover } from "@/components/sections/Cover";
import { Opening } from "@/components/sections/Opening";
import { Events } from "@/components/sections/Events";
import { LoveStory } from "@/components/sections/LoveStory";
import { Gallery } from "@/components/sections/Gallery";
import { WeddingGift } from "@/components/sections/WeddingGift";
import { Wishes } from "@/components/sections/Wishes";
import { Footer } from "@/components/sections/Footer";
import { MusicToggle } from "@/components/MusicToggle";
import { ParallaxBg } from "@/components/ui/ParallaxBg";
import { Reveal } from "@/components/ui/Reveal";

// Person-slide artwork (each: a dimmed mirrored backdrop + a sharp portrait).
const ART = {
  bride: { backdrop: "/images/bg-bride.png", portrait: "/images/invitation-bride.png" },
  groom: { backdrop: "/images/bg-groom.png", portrait: "/images/invitation-groom.png" },
} as const;

interface PersonSlideProps {
  person: typeof config.bride | typeof config.groom;
  /** Engraved word, e.g. "Bride" / "Groom". */
  label: string;
  /** Friendly name shown in the Instagram pill. */
  pillLabel: string;
  backdrop: string;
  portrait: string;
  /** Which edge the sharp portrait hugs (mirrors the mockup). */
  side: "left" | "right";
  /** Tailwind class for the dark backdrop overlay. */
  overlayClass: string;
}

/**
 * A full-screen invitation slide (min-h 100svh) rebuilt from the SVG mockups
 * (390×844 frame). Three stacked layers:
 *   1. a mirrored, dimmed backdrop covers the whole slide,
 *   2. a sharp portrait hugs one edge (top 8.2% / 86.15% × 59.72%),
 *   3. an engraved vertical label + name + Instagram pill + parents.
 * The composition lives in an aspect-[390/844] frame centered in the slide, so
 * every percentage matches the mockup while scaling fluidly on any screen.
 */
function PersonSlide({
  person,
  label,
  pillLabel,
  backdrop,
  portrait,
  side,
  overlayClass,
}: PersonSlideProps) {
  const hugRight = side === "right";
  const labelSpan = (
    <span className="writing-vertical mt-4 font-serif text-5xl font-bold uppercase tracking-[0.12em] text-white text-shadow-soft sm:text-6xl">
      {label}
    </span>
  );
  const theSpan = (
    <span className="writing-vertical mt-1 font-script text-3xl text-white/95 text-shadow-soft sm:text-4xl">
      The
    </span>
  );
  const portraitStyle: CSSProperties = {
    top: "8.2%",
    width: "86.15%",
    height: "59.72%",
    ...(hugRight ? { right: 0 } : { left: 0 }),
  };

  return (
    <section className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-ink">
      {/* 1 — Full-bleed backdrop (scroll fade + parallax) + overlays */}
      <ParallaxBg src={backdrop} overlayClassName={overlayClass} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      {/* Composition frame — mirrors the 390×844 mockup, centered in the slide */}
      <div className="relative aspect-[390/844] max-h-[100svh] w-full max-w-md">
        {/* 2 — Sharp portrait, hugging one edge with a subtle reveal */}
        <motion.img
          src={portrait}
          alt={person.name}
          initial={{ opacity: 0, scale: 1.06 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute object-cover object-top"
          style={portraitStyle}
        />

        {/* 3a — Engraved vertical label (opposite the portrait edge) */}
        <div
          className={cn(
            "absolute top-[12%] z-10 flex flex-col items-center leading-none",
            hugRight ? "left-[5%] rotate-180" : "right-[5%]",
          )}
        >
          {hugRight ? (
            <>
              {theSpan}
              {labelSpan}
            </>
          ) : (
            <>
              {theSpan}
              {labelSpan}
            </>
          )}
        </div>

        {/* 3b — Name + Instagram pill + parents */}
        <Reveal
          direction="up"
          delay={0.15}
          className={cn(
            "absolute inset-x-0 bottom-0 z-10 px-6 pb-[7%]",
            hugRight ? "text-right" : "text-left",
          )}
        >
          <h3 className="font-playball text-3xl leading-tight text-white text-shadow-soft sm:text-4xl">
            {person.shortName}
          </h3>

          <div className={cn("mt-3 flex", hugRight ? "justify-end" : "justify-start")}>
            <a
              href={`https://instagram.com/${person.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/90 px-4 py-1.5 font-serif text-lg text-white transition-colors hover:bg-white hover:text-ink"
            >
              <Contact className="h-4 w-4" />
              {pillLabel}
            </a>
          </div>

          <p
            className={cn(
              "mt-4 font-body text-base text-white/85 sm:text-lg",
              hugRight ? "text-right" : "text-left",
            )}
          >
            {person.order}
            <br />
            {person.parents}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Orchestrates the two states of the invitation:
 *  1. The cover (scroll locked) until the guest taps "Open Invitation".
 *  2. The full, scrollable invitation with background music.
 *
 * On desktop the invitation lives inside a fixed-height scroll panel.
 * `scrollContainerRef` points to that panel so scroll-lock and scroll-reset
 * target the panel instead of the document body / window.
 */
export function Invitation({
  guestName,
  scrollContainerRef,
}: {
  guestName: string;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const [opened, setOpened] = useState(false);

  // Lock scroll on the appropriate container while the cover is showing.
  useEffect(() => {
    const panel = scrollContainerRef?.current;
    if (panel) {
      panel.style.overflowY = opened ? "auto" : "hidden";
      return () => {
        panel.style.overflowY = "auto";
      };
    }
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened, scrollContainerRef]);

  function handleOpen() {
    setOpened(true);
    requestAnimationFrame(() => {
      if (scrollContainerRef?.current) {
        scrollContainerRef.current.scrollTo({ top: 0 });
      } else {
        window.scrollTo({ top: 0 });
      }
    });
  }

  return (
    <main className="relative mx-auto min-h-[100svh] w-full max-w-3xl bg-paper shadow-2xl shadow-black/20">
      <AnimatePresence>
        {!opened && (
          <motion.div
            key="cover"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="fixed inset-0 z-40 mx-auto max-w-3xl"
          >
            <Cover guestName={guestName} onOpen={handleOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      {opened && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Opening />
          <PersonSlide
            person={config.bride}
            label="Bride"
            pillLabel="Indri"
            backdrop={ART.bride.backdrop}
            portrait={ART.bride.portrait}
            side="right"
            overlayClass="bg-black/25"
          />
          <PersonSlide
            person={config.groom}
            label="Groom"
            pillLabel="Rafi"
            backdrop={ART.groom.backdrop}
            portrait={ART.groom.portrait}
            side="left"
            overlayClass="bg-black/55"
          />
          <Events />
          {/* Love Story + Gallery share one continuous backdrop */}
          <div className="relative isolate overflow-hidden bg-ink">
            <ParallaxBg
              src="/images/bg-story.png"
              overlayClassName="bg-black/70"
              className="-z-10"
            />
            <LoveStory />
            <Gallery />
          </div>
          <WeddingGift />
          <Wishes defaultName={guestName} />
          <Footer />
        </motion.div>
      )}

      <MusicToggle active={opened} />
    </main>
  );
}
