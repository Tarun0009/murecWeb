"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@shared/components/Section";
import { Eyebrow } from "@shared/components/Eyebrow";
import { LinkButton } from "@shared/components/LinkButton";
import { site } from "@data/site";

gsap.registerPlugin(ScrollTrigger);

export function Legacy() {
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const content = contentRef.current;
    const section = content?.closest("section");
    if (!content || !section) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-legacy-step]", content);

      const buildTimeline = (start: string, end: string, scrub: boolean | number) => {
        gsap.set(steps, { autoAlpha: 0, y: 42, filter: "blur(9px)" });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start,
            end,
            scrub,
            invalidateOnRefresh: true,
          },
        });

        steps.forEach((step) => {
          timeline.to(step, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.25,
            ease: "none",
          });
        });

        return () => timeline.kill();
      };

      media.add("(min-width: 768px)", () => buildTimeline("top bottom", "+=210%", true));
      media.add("(max-width: 767px)", () => {
        gsap.set(steps, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
        return () => gsap.set(steps, { clearProps: "opacity,visibility,transform,filter" });
      });
    }, content);

    ScrollTrigger.refresh();
    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <Section id="legacy" scene="legacy">
      <div ref={contentRef} className="grid gap-16 md:grid-cols-[0.9fr_1.1fr] md:gap-24">
        <div className="flex flex-col gap-8">
          <div data-legacy-step><Eyebrow index="01">The Legacy</Eyebrow></div>
          <div data-legacy-step>
            <h2 className="font-display text-5xl leading-[1.02] text-cream md:text-7xl">
              A legacy <span className="italic text-brass">beyond</span> compare.
            </h2>
          </div>
          <div data-legacy-step>
            <p className="max-w-md text-base leading-relaxed text-cream/70">
              For over seven decades, we stood for perseverance, integrity, and nation-building through enterprise.
              Every step was guided by one oath: quality before profit, trust before everything.
            </p>
          </div>
          <div data-legacy-step>
            <LinkButton href="#principles">Our history</LinkButton>
          </div>
        </div>

        <div className="flex flex-col justify-end md:pl-8">
          <div data-legacy-step>
            <div className="flex items-baseline gap-4 border-t border-cream/10 pt-8">
              <span className="font-display text-7xl leading-none text-brass md:text-9xl">
                {site.legacyYears}+
              </span>
              <span className="text-[11px] uppercase tracking-[0.28em] text-cream/50">
                years
                <br />
                of legacy
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
