"use client";

import { Section } from "@shared/components/Section";
import { Eyebrow } from "@shared/components/Eyebrow";
import { Reveal } from "@shared/components/Reveal";
import { LinkButton } from "@shared/components/LinkButton";

export function Collection() {
  return (
    <Section id="collection" scene="collection">
      <div className="max-w-3xl">
        <div className="flex flex-col gap-6 md:gap-7">
          <Eyebrow index="03">Portfolio</Eyebrow>
          <Reveal>
            <h2 className="font-display text-5xl leading-[1.02] text-cream md:text-7xl">
              MUREC <span className="italic text-brass">Collection</span>.
            </h2>
          </Reveal>
          <Reveal>
            <p className="max-w-lg text-base leading-relaxed text-cream/70">
              A portfolio shaped by legacy and guided by vision, the MUREC Collection is where every project reflects
              our way of building.
            </p>
          </Reveal>
          <Reveal>
            <LinkButton href="#philosophy">Discover more</LinkButton>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
