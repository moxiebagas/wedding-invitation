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
 * A full-bleed section background that fades in with the scroll position of
 * its own section while staying visually pinned to the viewport, so only the
 * foreground content moves. Pinning is pure CSS `position: sticky` — an
 * oversized frame (one viewport above/below the section) lets a viewport-tall
 * sticky child stay put for the section's entire transit, clipped back to the
 * section's own bounds. Sticky is handled on the compositor thread, so the
 * backdrop can never lag the scroll (a JS counter-translate runs a frame
 * behind threaded scrolling and visibly jitters; `position: fixed` breaks
 * inside the desktop layout's transformed scroll panel). Only the opacity
 * crossfade is scroll-driven JS, where a one-frame lag is imperceptible.
 *
 * Requires every ancestor between here and the scroll container to avoid
 * `overflow: hidden` (it silently disables sticky) — sections clip themselves
 * with `overflow-clip` instead, which does not create a scroll container.
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

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {/* Oversized sticky frame: extends 100lvh past both section edges so the
          sticky child pins from the moment the section enters the viewport
          until it fully leaves; clip-path trims it back to the section box
          (overflow can't be used — it would disable sticky). */}
      <div
        className="absolute inset-x-0 -bottom-[100lvh] -top-[100lvh]"
        style={{ clipPath: "inset(100lvh 0)" }}
      >
        <div className="sticky top-0 h-[100lvh]">
          <motion.img
            src={src}
            alt=""
            loading="eager"
            decoding="async"
            style={{ opacity }}
            className={cn(
              "h-full w-full object-cover object-center",
              mirror && "-scale-x-100",
              imgClassName,
            )}
          />
        </div>
      </div>
      {overlayClassName && <div className={cn("absolute inset-0", overlayClassName)} />}
    </div>
  );
}
