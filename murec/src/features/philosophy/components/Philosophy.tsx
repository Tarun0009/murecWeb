"use client";

import { Section } from "@shared/components/Section";
import { Eyebrow } from "@shared/components/Eyebrow";
import { Reveal } from "@shared/components/Reveal";
import { LinkButton } from "@shared/components/LinkButton";

export function Philosophy() {
  return (
    <Section id="philosophy" scene="philosophy" className="border-t border-cream/10">
      <div className="max-w-3xl">
        <div className="flex flex-col gap-6 md:gap-7">
          <Eyebrow index="04">Design philosophy</Eyebrow>
          <Reveal>
            <h2 className="font-display text-5xl leading-[1.02] text-cream md:text-7xl">
              <span className="italic text-brass">IGBC Certified</span> Design Philosophy.
            </h2>
          </Reveal>
          <Reveal>
            <p className="max-w-lg text-base leading-relaxed text-cream/65">
              The first MUREC collection is envisioned to align with the IGBC certification standards, reflecting a
              commitment to responsible development. From efficient resource planning to healthier living
              environments, the project integrates sustainability as a core design principle, thoughtfully, quietly,
              and with long-term impact in mind.
            </p>
          </Reveal>
          <Reveal>
            <LinkButton href="#partners">Discover more</LinkButton>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
