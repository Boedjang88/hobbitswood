"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

type AnimationDirection = "up" | "down" | "left" | "right" | "fade";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  once?: boolean;
}

const getVariants = (direction: AnimationDirection): Variants => {
  const offset = 40;
  const hidden: Record<string, number> = { opacity: 0 };
  
  switch (direction) {
    case "up":    hidden.y = offset; break;
    case "down":  hidden.y = -offset; break;
    case "left":  hidden.x = offset; break;
    case "right": hidden.x = -offset; break;
    case "fade":  break;
  }

  return {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };
};

export default function AnimateOnScroll({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6,
  once = false,
}: AnimateOnScrollProps) {
  const variants = getVariants(direction);

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
