"use client";

import { createContext, useContext, useEffect, useRef, type RefObject } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
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
 * its own section while staying visually pinned to the viewport: the image is
 * viewport-sized and counter-translated against the section's scroll movement,
 * so only the foreground content moves. (`position: fixed` can't be used here —
 * the desktop layout scrolls inside a transformed panel, which re-anchors fixed
 * descendants.) Driven by framer-motion's `useScroll` (rAF + passive).
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

  // Pin the backdrop: with the ["start end", "end start"] offsets, progress p
  // maps to a section top of `viewport - p * (viewport + section)` relative to
  // the viewport, so translating the image by the inverse keeps it static on
  // screen while the section (and its content) scrolls past.
  const dims = useRef({ viewport: 0, section: 0 });
  const y = useMotionValue(0);
  const pin = (p: number) =>
    y.set(p * (dims.current.viewport + dims.current.section) - dims.current.viewport);
  useMotionValueEvent(scrollYProgress, "change", pin);
  useEffect(() => {
    const measure = () => {
      dims.current = {
        viewport: container?.current?.clientHeight ?? window.innerHeight,
        section: ref.current?.offsetHeight ?? 0,
      };
      pin(scrollYProgress.get());
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (ref.current) observer.observe(ref.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container]);

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
          // h-screen (not the section height): the image is a viewport-sized
          // "window" that the pin translation holds in place on screen.
          "absolute left-0 top-0 h-screen w-full object-cover object-center",
          mirror && "-scale-x-100",
          imgClassName,
        )}
      />
      {overlayClassName && <div className={cn("absolute inset-0", overlayClassName)} />}
    </div>
  );
}
