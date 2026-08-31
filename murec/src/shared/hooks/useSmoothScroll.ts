"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) {
      ScrollTrigger.config({ ignoreMobileResize: true });
    }

    const lenis = new Lenis({
      lerp: isTouchDevice ? 0.1 : 0.07,
      smoothWheel: true,
      wheelMultiplier: 0.55,
      touchMultiplier: isTouchDevice ? 1 : 0.9,
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchInertiaExponent: 1.7,
      gestureOrientation: "vertical",
      overscroll: false,
    });

    const updateLenis = (time: number) => lenis.raf(time * 1000);
    const updateScrollTrigger = () => ScrollTrigger.update();

    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    const onAnchorClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const anchor = el.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id) as HTMLElement | null;
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -64, duration: 1.4 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(updateLenis);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
    };
  }, []);
}
