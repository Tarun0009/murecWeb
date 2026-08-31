"use client";

import { motion } from "framer-motion";
import { ease } from "@shared/lib/motion";
import { cn } from "@shared/lib/cn";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p";
};

export function SplitText({ text, className, delay = 0, stagger = 0.06, as = "h1" }: Props) {
  const Tag = motion[as];
  const words = text.split(" ");

  return (
    <Tag
      className={cn("inline-block", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.35 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.15em]">
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "110%" },
              show: { y: "0%", transition: { duration: 1.05, ease } },
            }}
          >
            {word}
            {i < words.length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
