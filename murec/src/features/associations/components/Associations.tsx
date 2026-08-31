"use client";

import { Section } from "@shared/components/Section";
import { Eyebrow } from "@shared/components/Eyebrow";
import { Reveal } from "@shared/components/Reveal";
import { DepthCarousel } from "@shared/components/DepthCarousel";

const associationLogos = [
  { image: "/associations/bajaj.webp", alt: "Bajaj", surface: "light" as const, cropLeftArtwork: true },
  { image: "/associations/design-forum-international.webp", alt: "Design Forum International", surface: "dark" as const },
  { image: "/associations/bobby-mukherji-architects.webp", alt: "Bobby Mukherji Architects", surface: "dark" as const },
  { image: "/associations/red-brick-international.webp", alt: "Red Brick International", surface: "dark" as const },
  { image: "/associations/tq.webp", alt: "TQ", surface: "light" as const, cropLeftArtwork: true },
];

export function Associations() {
  return (
    <Section id="associations" scrollLength={400} className="min-h-dvh border-y border-cream/10 bg-ink-raised" bare>
      <div className="flex min-h-dvh items-center py-20 sm:py-24 lg:py-28">
        <div className="grid w-full items-center gap-12 md:grid-cols-[0.78fr_1.22fr] md:gap-14 lg:gap-16">
        <div className="flex max-w-xl flex-col gap-6 md:gap-7">
          <Eyebrow>Our associations</Eyebrow>
          <Reveal>
            <h2 className="font-display text-5xl leading-[0.98] text-cream md:text-7xl">
              Partnerships built on <span className="italic text-brass">trust</span>.
            </h2>
          </Reveal>
          <Reveal>
            <p className="max-w-md text-base leading-relaxed text-cream/65">
              A circle of collaborators united by enduring standards, shared ambition, and thoughtful execution.
            </p>
          </Reveal>
          <div className="mt-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-cream/40">
            <span>Scroll through associations</span>
            <span className="h-px w-12 bg-brass/50" />
          </div>
        </div>
        <DepthCarousel
          items={associationLogos}
          cardWidth={300}
          cardHeight={190}
          depth={390}
          spread={62}
          tilt={24}
          perspective={1050}
          scrollDriven
          className="min-h-[430px]"
        />
        </div>
      </div>
    </Section>
  );
}
