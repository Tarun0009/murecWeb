"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const PreloaderScene = dynamic(() => import("./PreloaderScene"), {
  ssr: false,
  loading: () => null,
});

const EASE = [0.22, 1, 0.36, 1] as const;

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isSmallDevice = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    const minimumDuration = isSmallDevice ? 2200 : 2800;
    const maximumDuration = 5200;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    const start = performance.now();
    let rafId = 0;
    let exitTimer = 0;
    let assetsReady = false;
    let finished = false;

    const logo = new window.Image();
    logo.src = "/brand/murec-logo.webp";
    const logoReady = logo.decode?.().catch(() => undefined) ?? Promise.resolve();
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    Promise.allSettled([logoReady, fontsReady]).then(() => {
      assetsReady = true;
    });

    const unlockPage = () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      progressRef.current = 1;
      setProgress(1);
      exitTimer = window.setTimeout(() => {
        unlockPage();
        setVisible(false);
      }, 320);
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      const timedProgress = Math.min(1, elapsed / minimumDuration);
      const p = assetsReady ? timedProgress : Math.min(0.92, timedProgress * 0.92);
      progressRef.current = p;
      setProgress(p);
      if ((assetsReady && elapsed >= minimumDuration) || elapsed >= maximumDuration) {
        finish();
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(exitTimer);
      unlockPage();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="fixed inset-0 z-[100] h-[100svh] w-screen touch-none overscroll-none bg-ink"
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
