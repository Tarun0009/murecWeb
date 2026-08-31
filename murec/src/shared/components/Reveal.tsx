"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { ease } from "@shared/lib/motion";

type Props = {
  children: ReactNode;
  y?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "span" | "p" | "h2" | "h3" | "li";
};

const variants: Variants = {
  hidden: (custom: { delay: number; y: number }) => ({
    opacity: 0,
    y: custom.y,
    scale: 0.985,
    filter: "blur(8px)",
    clipPath: "inset(0 0 100% 0)",
  }),
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    clipPath: "inset(0 0 0% 0)",
    transition: {
      duration: 1.05,
      ease,
      delay: 0,
      opacity: { duration: 0.72, delay: 0 },
      filter: { duration: 0.82, delay: 0 },
    },
  },
};

export function Reveal({ children, y = 32, once = false, className, as = "div" }: Props) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={variants}
      custom={{ y }}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-12% 0px" }}
      style={{ transformOrigin: "50% 100%", willChange: "transform, opacity, clip-path, filter" }}
    >
      {children}
    </Component>
  );
}
