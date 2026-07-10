"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_LUXE } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 36 },
  down: { y: -36 },
  left: { x: 36 },
  right: { x: -36 },
  none: {},
};

interface RevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  /** Add a soft focus-pull (blur → sharp) for a more filmic, wedding-y reveal. */
  blur?: boolean;
}

/** Fade + slide a block into view the first time it scrolls onto screen. */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  blur = false,
}: RevealProps) {
  const variants: Variants = {
    hidden: { opacity: 0, ...offset[direction], ...(blur && { filter: "blur(10px)" }) },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      ...(blur && { filter: "blur(0px)" }),
      transition: { duration: 0.9, ease: EASE_LUXE, delay },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
