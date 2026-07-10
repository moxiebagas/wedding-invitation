"use client";

import { motion, type Variants } from "framer-motion";
import { MailOpen } from "lucide-react";
import { config } from "@/lib/config";
import { EASE_LUXE } from "@/lib/utils";
import { Photo } from "@/components/ui/Photo";

interface CoverProps {
  guestName: string;
  onOpen: () => void;
}

// Each block cascades its lines in one after another (blur → sharp).
const cascade: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.15 } },
};

const line: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE_LUXE },
  },
};

export function Cover({ guestName, onOpen }: CoverProps) {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-mist">
      {/* Full-bleed prewedding photo */}
      <Photo
        src={config.coverPhoto}
        alt="Indri & Rafi"
        priority
        className="absolute inset-0 h-full w-full"
      />
      {/* Light wash at the top (for dark text) + soft darkening at the bottom (for white text) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/0 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />

      {/* Top-left title block — dark text on the bright studio backdrop */}
      <motion.div
        variants={cascade}
        initial="hidden"
        animate="visible"
        className="absolute left-0 top-[7%] z-10 max-w-[80%] px-7 text-left sm:top-[10%] sm:px-8"
      >
        <motion.p
          variants={line}
          className="font-serif text-xs uppercase tracking-[0.3em] text-ink/70 sm:text-sm"
        >
          The Wedding Of
        </motion.p>
        <motion.h1
          variants={line}
          className="mt-2 font-serif text-3xl font-bold leading-[1.12] text-ink sm:text-3xl"
        >
          {config.bride.name} <span className="font-script font-normal italic">&amp;</span>
        </motion.h1>
        <motion.h1
          variants={line}
          className="font-serif text-3xl font-bold leading-[1.12] text-ink sm:text-3xl"
        >
          {config.groom.name}
        </motion.h1>
        {/* Thin underline drawing itself out from the left edge */}
        <motion.span
          variants={{
            hidden: { scaleX: 0, opacity: 0 },
            visible: {
              scaleX: 1,
              opacity: 1,
              transition: { duration: 0.8, ease: EASE_LUXE },
            },
          }}
          className="mt-3 block h-px w-24 origin-left bg-gradient-to-r from-ink/60 to-transparent"
        />
        <motion.p
          variants={line}
          className="mt-2 font-body text-base tracking-[0.25em] text-ink/70 sm:text-lg"
        >
          {config.weddingDateShort}
        </motion.p>
      </motion.div>

      {/* Bottom-center invitee block — white text over the darker lower frame */}
      <motion.div
        variants={cascade}
        initial="hidden"
        animate="visible"
        transition={{ delayChildren: 0.5 }}
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-6 pb-10 text-center sm:pb-12"
      >
        <motion.p
          variants={line}
          className="font-body text-base font-semibold text-white text-shadow-soft sm:text-lg"
        >
          Kepada Yth. Bapak/Ibu/Saudara/i
        </motion.p>
        <motion.p
          variants={line}
          className="mt-1 font-serif text-2xl font-semibold text-white text-shadow-soft sm:text-3xl"
        >
          {guestName}
        </motion.p>
        <motion.p
          variants={line}
          className="mt-1 font-body text-sm text-white/80 text-shadow-soft sm:text-base"
        >
          Di Tempat
        </motion.p>

        <motion.div variants={line} className="relative mt-5">
          {/* Soft pulsing halo behind the button — a quiet "tap me" cue */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-white/40 blur-md"
            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
          />
          <motion.button
            onClick={onOpen}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-ink shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-colors hover:bg-ink hover:text-white"
          >
            <MailOpen className="h-5 w-5 animate-bounce transition-transform" />
            <span className="font-script text-xl leading-none">Open Invitation</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
