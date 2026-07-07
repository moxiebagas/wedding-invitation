"use client";

import { createContext, useContext, useRef, type RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * On desktop the invitation scrolls inside its own panel
 * (`ResponsiveInvitationLayout`'s right panel) instead of the window, so
 * `useScroll` needs to track that panel's scroll instead of the window's.
 * `ScrollContainerProvider` supplies that panel ref; when absent (e.g. on
 * mobile, where the window itself scrolls) every `ParallaxBg` falls back to
 * tracking the window, so nothing needs to change at the call sites.
 */
const ScrollContainerContext = createContext<RefObject<HTMLDivElement | null> | null>(
  null,
);

export function ScrollContainerProvider({
  containerRef,
  children,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  return (
    <ScrollContainerContext.Provider value={containerRef}>
      {children}
    </ScrollContainerContext.Provider>
  );
}

interface ParallaxBgProps {
  src: string;
  /** Extra classes for the clipping wrapper (e.g. z-index). */
  className?: string;
  /** Extra classes for the image (e.g. object-position). */
  imgClassName?: string;
  /** Optional dark overlay for legibility, e.g. "bg-black/60". */
  overlayClassName?: string;
  /** Mirror the image horizontally. */
  mirror?: boolean;
}

/**
 * A full-bleed section background that fades in and gently parallaxes with the
 * scroll position of its own section. As the next section scrolls into view its
 * backdrop "follows" the scroll instead of snapping in. Driven by
 * framer-motion's `useScroll` (rAF + passive) — no manual scroll listeners.
 */
export function ParallaxBg({
  src,
  className,
  imgClassName,
  overlayClassName,
  mirror,
}: ParallaxBgProps) {
  const ref = useRef<HTMLDivElement>(null);
  const container = useContext(ScrollContainerContext);
  const { scrollYProgress } = useScroll({
    target: ref,
    container: container ?? undefined,
    offset: ["start end", "end start"],
  });
  // Crossfade curve: this background fades IN as the section enters (reaching
  // full before it centers) and fades OUT as it leaves — so it overlaps the
  // next section's fade-in for a smooth, non-abrupt hand-off.
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0.2]);
  // Gentle vertical parallax. The image is 120% tall and only drifts upward,
  // so it always covers the section (no edge gaps / layout shift).
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <motion.img
        src={src}
        alt=""
        loading="eager"
        decoding="async"
        style={{ opacity, y }}
        className={cn(
          "absolute left-0 top-0 h-[120%] w-full object-cover object-center",
          mirror && "-scale-x-100",
          imgClassName,
        )}
      />
      {overlayClassName && <div className={cn("absolute inset-0", overlayClassName)} />}
    </div>
  );
}
