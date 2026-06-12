"use client";

import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";
import { config } from "@/lib/config";

/** Floating background-music toggle. Tries to autoplay once the invite opens. */
export function MusicToggle({ active }: { active: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!active || !audioRef.current) return;
    audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false)); // browsers may block autoplay
  }, [active]);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => undefined);
    }
  }

  if (!active) return null;

  return (
    <>
      <audio ref={audioRef} src={config.music} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? "Matikan musik" : "Putar musik"}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-ink/85 text-white shadow-lg backdrop-blur transition-transform hover:scale-105"
      >
        {playing ? (
          <Music className="h-5 w-5 animate-spin [animation-duration:4s]" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </button>
    </>
  );
}
