import { motion, type Variants } from "framer-motion";
import { cn, EASE_LUXE } from "@/lib/utils";

interface SectionTitleProps {
  /** Small serif word rendered in caps, e.g. "WEDDING". */
  overline?: string;
  /** The flowing script word, e.g. "Event" or "Love Story". */
  script: string;
  className?: string;
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_LUXE },
  },
};

// The thin divider draws itself outward from the centre after the words land.
const divider: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.7, ease: EASE_LUXE },
  },
};

/**
 * The recurring section heading: an uppercase serif word stacked with a
 * large graphite script word and a thin divider — the three parts cascade in
 * (blur → sharp) on scroll, then the divider draws out from the centre.
 */
export function SectionTitle({ overline, script, className }: SectionTitleProps) {
  return (
    <motion.div
      className={cn("text-center", className)}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      {overline && (
        <motion.p
          variants={item}
          className="font-serif text-sm uppercase tracking-[0.45em] text-ash sm:text-base"
        >
          {overline}
        </motion.p>
      )}
      <motion.h2
        variants={item}
        className="-mt-1 font-script text-5xl leading-tight text-graphite sm:text-6xl"
      >
        {script}
      </motion.h2>
      <motion.span variants={divider} className="rule-divider mt-3" />
    </motion.div>
  );
}
