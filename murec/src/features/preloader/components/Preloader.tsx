"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const sceneReadyRef = useRef(false);

  const onSceneReady = useCallback(() => {
    sceneReadyRef.current = true;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const minimumDuration = 2800;
    const maximumDuration = 12000;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    const start = performance.now();
    let animationStart = 0;
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
      const ready = assetsReady && sceneReadyRef.current;
      if (ready && animationStart === 0) animationStart = now;
      const animationElapsed = animationStart === 0 ? 0 : now - animationStart;
      const timedProgress = Math.min(1, animationElapsed / minimumDuration);
      const p = ready ? timedProgress : 0;
      progressRef.current = p;
      setProgress(p);
      if ((ready && animationElapsed >= minimumDuration) || elapsed >= maximumDuration) {
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
            <PreloaderScene progressRef={progressRef} onReady={onSceneReady} />
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
                width={202}
                height={107}
                priority
                className="h-auto w-[138px] object-contain sm:w-[160px] md:w-[190px]"
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

          <div
            className="pointer-events-none absolute inset-x-0 flex flex-col items-center gap-3 md:bottom-14"
            style={{ bottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
          >
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
