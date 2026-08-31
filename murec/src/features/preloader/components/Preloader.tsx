"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const PreloaderScene = dynamic(() => import("./PreloaderScene"), {
  ssr: false,
  loading: () => null,
});

const DURATION_MS = 3000;
const EASE = [0.22, 1, 0.36, 1] as const;

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.style.overflow = "hidden";

    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION_MS);
      progressRef.current = p;
      setProgress(p);
      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setVisible(false), 450);
      }
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    if (!visible) document.body.style.overflow = "";
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="fixed inset-0 z-[100] bg-ink"
        >
          <div className="absolute inset-0">
            <PreloaderScene progressRef={progressRef} />
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(15,14,12,0.65) 100%)",
            }}
          />

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
            >
              <Image
                src="/brand/murec-logo.webp"
                alt="MUREC"
                width={160}
                height={160}
                priority
                className="h-16 w-auto md:h-24"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
              className="text-[10px] uppercase tracking-[0.42em] text-cream/55"
            >
              78+ years of legacy
            </motion.div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-3 md:bottom-14">
            <div className="font-display text-sm tabular-nums text-cream/60">
              {String(Math.round(progress * 100)).padStart(3, "0")}
            </div>
            <div className="relative h-px w-48 overflow-hidden bg-cream/10 md:w-72">
              <motion.div
                className="absolute inset-y-0 left-0 bg-brass"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
