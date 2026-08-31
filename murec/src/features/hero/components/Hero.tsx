"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "@shared/components/SplitText";
import { LinkButton } from "@shared/components/LinkButton";
import { ease } from "@shared/lib/motion";
import { site } from "@data/site";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const sceneScroll = useRef(0);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useLayoutEffect(() => {
    const hero = ref.current;
    if (!hero) return;

    const media = gsap.matchMedia();
    media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "+=110%",
        pin: true,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          sceneScroll.current = self.progress;
        },
      });
    });

    media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          sceneScroll.current = self.progress;
        },
      });
    });

    return () => media.revert();
  }, []);

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate flex min-h-dvh flex-col overflow-hidden py-24 sm:py-28 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0">
          <HeroScene scrollRef={sceneScroll} />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-ink to-transparent" />
        <div className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-ink via-ink/76 to-transparent sm:w-3/4 lg:w-[58%]" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="container-page relative z-10 grid min-h-[calc(100dvh-12rem)] flex-1 items-center md:min-h-[calc(100dvh-16rem)] lg:grid-cols-[minmax(0,0.88fr)_minmax(420px,1.12fr)]"
      >
        <div className="mx-auto flex w-full max-w-[580px] flex-col items-center text-center sm:mx-0 sm:items-start sm:text-left lg:translate-y-[2vh] lg:pr-8">
          <SplitText
            text="Explore"
            className="font-display block text-[clamp(72px,17vw,118px)] font-normal leading-[0.82] text-cream md:text-[clamp(108px,10vw,154px)]"
            as="h1"
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ duration: 0.72, ease }}
            className="mt-4 flex w-full items-center justify-center sm:mt-5 sm:justify-start"
          >
            <Image
              src="/brand/madhusudan-logo.webp"
              alt="Madhusudan"
              width={320}
              height={128}
              priority
              className="h-auto w-full max-w-[240px] object-contain sm:max-w-[290px] md:max-w-[350px]"
            />
          </motion.div>
          <div className="mt-10 w-full sm:mt-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.72, ease }}
              className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-start sm:gap-8"
            >
              <p className="font-display whitespace-nowrap text-2xl leading-[1.1] text-cream md:text-3xl lg:text-4xl">
                <span className="italic text-brass">{site.legacyYears}+</span> years of legacy.
              </p>
              <span aria-hidden className="hidden h-10 w-px bg-cream/15 sm:block" />
              <LinkButton href="#legacy">Learn more</LinkButton>
            </motion.div>
          </div>
        </div>

      </motion.div>
    </section>
  );
}
