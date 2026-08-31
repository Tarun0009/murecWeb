import type { Variants, Transition } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease, delay: i * 0.06 },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease } },
};

export const stagger = (delayChildren = 0.1, staggerChildren = 0.08): Variants => ({
  hidden: {},
  show: {
    transition: { delayChildren, staggerChildren },
  },
});

export const softSpring: Transition = {
  type: "spring",
  stiffness: 140,
  damping: 22,
  mass: 0.6,
};
