"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Section } from "@shared/components/Section";
import { Eyebrow } from "@shared/components/Eyebrow";
import { Reveal } from "@shared/components/Reveal";
import { partners } from "@data/partners";
import { ease } from "@shared/lib/motion";

export function Partners() {
  return (
    <Section id="partners" scene="partners">
      <div className="mb-12 flex flex-col gap-6 md:mb-16">
        <Eyebrow index="05">From our partners</Eyebrow>
        <Reveal>
          <h2 className="font-display text-5xl leading-[1.02] text-cream md:max-w-3xl md:text-7xl">
            The people who help us <span className="italic text-brass">draw the line</span>.
          </h2>
        </Reveal>
      </div>

      <ul className="grid gap-6 lg:gap-8 xl:grid-cols-2">
        {partners.map((p) => (
          <motion.li
            key={p.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease }}
            className="glass-surface group grid min-h-[430px] overflow-hidden border-cream/12 p-0 sm:grid-cols-[42%_58%]"
          >
            <div className="relative min-h-[300px] overflow-hidden sm:min-h-full">
              <Image
                src={p.portrait}
                alt={p.name}
                fill
                sizes="(min-width: 1280px) 260px, (min-width: 640px) 40vw, 100vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/35 via-transparent to-transparent sm:bg-linear-to-r sm:from-transparent sm:to-ink/12" />
            </div>
            <div className="flex min-w-0 flex-col p-6 sm:p-7 lg:p-8">
              <h3 className="font-display text-3xl leading-none text-cream md:text-4xl">{p.name}</h3>
              <span className="mt-4 h-px w-12 bg-brass/70" />
              <blockquote className="mt-6 text-sm leading-[1.75] text-cream/72 md:text-[15px]">
                “{p.quote}”
              </blockquote>
              <div className="mt-auto pt-8">
                <div className="relative h-14 w-full max-w-[230px]">
                  <Image
                    src={p.logo}
                    alt={p.logoAlt}
                    fill
                    sizes="230px"
                    className="object-contain object-left"
                  />
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
