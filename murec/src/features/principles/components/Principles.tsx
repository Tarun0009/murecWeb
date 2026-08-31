"use client";

import { Section } from "@shared/components/Section";
import { Eyebrow } from "@shared/components/Eyebrow";
import { LinkButton } from "@shared/components/LinkButton";

export function Principles() {
  return (
    <Section id="principles" scene="principles" className="border-t border-cream/10 bg-ink-raised">
      <div className="relative flex items-center">
        <div className="w-full max-w-3xl">
          <article className="flex flex-col justify-center gap-6 md:gap-7">
            <Eyebrow index="02">Our values</Eyebrow>
            <h2 className="font-display max-w-2xl text-5xl leading-[0.98] text-cream md:text-7xl">
              Living by <span className="italic text-brass">principles</span>.
            </h2>
            <p className="max-w-md text-base leading-relaxed text-cream/65">
              MUREC is guided by values that shape every decision, building trust, delivering quality, practicing
              transparency, and embracing innovation as the foundation of everything we create.
            </p>
            <div><LinkButton href="#collection">Explore more</LinkButton></div>
          </article>
        </div>
      </div>
    </Section>
  );
}
