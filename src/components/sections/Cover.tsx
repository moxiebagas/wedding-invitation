"use client";

import { motion } from "framer-motion";
import { MailOpen } from "lucide-react";
import { config } from "@/lib/config";
import { Photo } from "@/components/ui/Photo";

interface CoverProps {
  guestName: string;
  onOpen: () => void;
}

export function Cover({ guestName, onOpen }: CoverProps) {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-mist">
      {/* Full-bleed prewedding photo */}
      <Photo
        src={config.coverPhoto}
        alt="Indri & Rafi"
        priority
        kenBurns
        className="absolute inset-0 h-full w-full"
      />
      {/* Light wash at the top (for dark text) + soft darkening at the bottom (for white text) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/0 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />

      {/* Top-left title block — dark text on the bright studio backdrop */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="absolute left-0 top-0 z-10 max-w-[80%] p-7 text-left sm:p-10"
      >
        <p className="font-serif text-xs uppercase tracking-[0.3em] text-ink/70 sm:text-sm">
          The Wedding Of
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold leading-[1.12] text-ink sm:text-5xl">
          {config.bride.name} <span className="font-script font-normal italic">&amp;</span>
        </h1>
        <h1 className="font-serif text-3xl font-bold leading-[1.12] text-ink sm:text-5xl">
          {config.groom.name}
        </h1>
        <p className="mt-2 font-body text-base tracking-[0.25em] text-ink/70 sm:text-lg">
          {config.weddingDateShort}
        </p>
      </motion.div>

      {/* Bottom-center invitee block — white text over the darker lower frame */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-6 pb-10 text-center sm:pb-12"
      >
        <p className="font-body text-base font-semibold text-white text-shadow-soft sm:text-lg">
          Kepada Yth. Bapak/Ibu/Saudara/i
        </p>
        <p className="mt-1 font-serif text-2xl font-semibold text-white text-shadow-soft sm:text-3xl">
          {guestName}
        </p>
        <p className="mt-1 font-body text-sm text-white/80 text-shadow-soft sm:text-base">
          Di Tempat
        </p>

        <motion.button
          onClick={onOpen}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-ink shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-colors hover:bg-ink hover:text-white"
        >
          <MailOpen className="h-5 w-5" />
          <span className="font-script text-xl leading-none">Open Invitation</span>
        </motion.button>
      </motion.div>
    </section>
  );
}
