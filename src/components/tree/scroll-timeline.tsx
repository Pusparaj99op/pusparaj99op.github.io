"use client";

import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

// Matches Timeline's p-4 padding plus half of the 40px (size-10) badge.
const LINE_OFFSET_PX = 36;

type Rail = { top: number; height: number };

export function ScrollTimeline({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rail, setRail] = useState<Rail>({ top: LINE_OFFSET_PX, height: 0 });
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const badges = container.querySelectorAll<HTMLElement>("[data-milestone-badge]");
      if (badges.length < 2) return;
      const box = container.getBoundingClientRect();
      const first = badges[0].getBoundingClientRect();
      const last = badges[badges.length - 1].getBoundingClientRect();
      const top = first.top + first.height / 2 - box.top;
      setRail({ top, height: last.top + last.height / 2 - box.top - top });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <motion.div
        aria-hidden
        className="absolute z-10 w-0.5 -translate-x-1/2 origin-top rounded-full bg-linear-to-b from-amber-500 via-emerald-500 to-violet-500"
        style={{
          left: LINE_OFFSET_PX,
          top: rail.top,
          height: rail.height,
          scaleY: prefersReducedMotion ? 1 : scaleY,
        }}
      />
      {children}
    </div>
  );
}

export function MilestoneBadge({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      data-milestone-badge
      initial={prefersReducedMotion ? false : { scale: 0.4, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -35% 0px" }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      {children}
    </motion.div>
  );
}
