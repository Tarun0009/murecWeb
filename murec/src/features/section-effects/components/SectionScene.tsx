"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneVariant } from "./variants";

gsap.registerPlugin(ScrollTrigger);

const SceneCanvas = dynamic(() => import("./SceneCanvas"), {
  ssr: false,
  loading: () => null,
});

type Props = {
  variant: SceneVariant;
  className?: string;
};

export function SectionScene({ variant, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const scrollRef = useRef(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const trigger = ScrollTrigger.create({
      trigger: element.parentElement,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.12,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        scrollRef.current = self.progress;
      },
    });

    ScrollTrigger.refresh();

    return () => trigger.kill();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { rootMargin: "120% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 ${className ?? ""}`}
      style={{
        WebkitMaskImage:
          "radial-gradient(ellipse at 50% 50%, black 68%, transparent 98%)",
        maskImage: "radial-gradient(ellipse at 50% 50%, black 68%, transparent 98%)",
      }}
    >
      {live && <SceneCanvas variant={variant} scrollRef={scrollRef} />}
    </div>
  );
}
