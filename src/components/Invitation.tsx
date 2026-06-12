"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { config } from "@/lib/config";
import { Cover } from "@/components/sections/Cover";
import { Opening } from "@/components/sections/Opening";
import { Profile } from "@/components/sections/Profile";
import { Events } from "@/components/sections/Events";
import { LoveStory } from "@/components/sections/LoveStory";
import { Gallery } from "@/components/sections/Gallery";
import { Wishes } from "@/components/sections/Wishes";
import { Footer } from "@/components/sections/Footer";
import { MusicToggle } from "@/components/MusicToggle";

/**
 * Orchestrates the two states of the invitation:
 *  1. The cover (scroll locked) until the guest taps "Open Invitation".
 *  2. The full, scrollable invitation with background music.
 */
export function Invitation({ guestName }: { guestName: string }) {
  const [opened, setOpened] = useState(false);

  // Lock body scroll while the cover is showing.
  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  function handleOpen() {
    setOpened(true);
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
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
          <Profile person={config.bride} label="The Bride" side="right" />
          <Profile person={config.groom} label="The Groom" side="left" />
          <Events />
          <LoveStory />
          <Gallery />
          <Wishes defaultName={guestName} />
          <Footer />
        </motion.div>
      )}

      <MusicToggle active={opened} />
    </main>
  );
}
