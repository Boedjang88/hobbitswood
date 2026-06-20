"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ProductRevealProps {
  children: ReactNode;
}

export default function ProductReveal({ children }: ProductRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 60%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scale = useTransform(smoothProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className="origin-bottom will-change-transform"
    >
      {children}
    </motion.div>
  );
}
