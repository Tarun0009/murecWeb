"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@shared/lib/cn";

type Props = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "outline" | "ghost" | "solid";
  className?: string;
};

export function LinkButton({ href, onClick, children, variant = "outline", className }: Props) {
  const base =
    "group relative inline-flex items-center gap-3 rounded-pill px-6 py-3 text-[13px] uppercase tracking-[0.22em] transition-colors";
  const styles = {
    outline: "border border-cream/25 bg-cream/[0.045] text-cream shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md hover:border-brass hover:bg-brass/[0.08] hover:text-brass",
    ghost: "text-cream hover:text-brass",
    solid: "bg-cream text-ink hover:bg-brass",
  } as const;

  const content = (
    <motion.span
      className={cn(base, styles[variant], className)}
      whileHover={{ y: -1 }}
      whileTap={{ y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <span>{children}</span>
      <span aria-hidden className="text-lg leading-none transition-transform duration-500 group-hover:translate-x-1">→</span>
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className="inline-block">
      {content}
    </button>
  );
}
