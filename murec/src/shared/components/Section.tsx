"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@shared/lib/cn";
import { SectionScene } from "@features/section-effects/components/SectionScene";
import type { SceneVariant } from "@features/section-effects/components/variants";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  id?: string;
  children: ReactNode;
  className?: string;
  bare?: boolean;
  scene?: SceneVariant;
  scrollLength?: number;
};

export function Section({ id, children, className, bare = false, scene, scrollLength = 110 }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const media = gsap.matchMedia();
    media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollLength}%`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .fromTo(
          content,
          { scale: 0.89, y: 64, autoAlpha: 0.42, filter: "blur(7px)" },
          { scale: 1, y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.48, ease: "none" }
        )
        .to(content, { scale: 1.065, y: -36, autoAlpha: 0.72, duration: 0.52, ease: "none" });
    });

    media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        content,
        { scale: 0.94, y: 42, autoAlpha: 0.28, filter: "blur(5px)" },
        {
          scale: 1,
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 92%",
            end: "top 34%",
            scrub: 0.1,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    return () => media.revert();
  }, [id, scene, scrollLength]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(!bare && "section", "relative isolate overflow-x-clip", className)}
    >
      {scene && <SectionScene variant={scene} />}
      <div ref={contentRef} className="container-page relative z-10">{children}</div>
    </section>
  );
}
