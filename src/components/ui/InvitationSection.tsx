"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ParallaxBg } from "./ParallaxBg";

interface InvitationSectionProps {
  /** Section background image path, e.g. "/images/bg-event.jpg". */
  backgroundImage: string;
  children: ReactNode;
  /** Classes for the <section> (layout, min-height, base colour, etc.). */
  className?: string;
  /** Classes for the content wrapper (the part that animates in). */
  contentClassName?: string;
  /** Optional dark/light overlay for readability, e.g. "bg-black/60". */
  overlayClassName?: string;
  /** Delay (s) before the content reveals, so it follows the background. */
  contentDelay?: number;
  /** Mirror the background horizontally. */
  mirror?: boolean;
  id?: string;
}

/**
 * Reusable section shell that unifies the cross-section transition:
 *   1. the background fades in (and the previous one fades out) on scroll via
 *      ParallaxBg — the next backdrop appears first,
 *   2. the content then reveals with a subtle fade + slide-up + scale,
 *      timed slightly after the background by `contentDelay`.
 *
 * Each section just supplies its own `backgroundImage` and content. Add a new
 * animated section by wrapping its markup in <InvitationSection>.
 */
export function InvitationSection({
  backgroundImage,
  children,
  className,
  contentClassName,
  overlayClassName,
  contentDelay = 0.2,
  mirror,
  id,
}: InvitationSectionProps) {
  return (
    <section id={id} className={cn("relative w-full overflow-hidden", className)}>
      <ParallaxBg
        src={backgroundImage}
        overlayClassName={overlayClassName}
        mirror={mirror}
      />
      <motion.div
        className={cn("relative z-10", contentClassName)}
        initial={{ opacity: 0, y: 24, scale: 0.99 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: contentDelay }}
      >
        {children}
      </motion.div>
    </section>
  );
}
