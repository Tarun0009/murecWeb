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
        <div className="absolute inset-y-0 left-0 w-3/4 bg-linear-to-r from-ink via-ink/70 to-transparent md:w-1/2" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="container-page relative z-10 flex min-h-[calc(100dvh-12rem)] flex-1 items-center md:min-h-[calc(100dvh-16rem)]"
      >
        <div className="flex w-full max-w-[980px] flex-col items-start gap-5 sm:gap-6 md:gap-8">
          <SplitText
            text="Explore"
            className="font-display block text-[clamp(72px,17vw,118px)] font-normal leading-[0.82] text-cream md:text-[clamp(112px,11vw,168px)]"
            as="h1"
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ duration: 0.72, ease }}
            className="flex w-full items-center"
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
          <div className="mt-1 max-w-md md:mt-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.72, ease }}
              className="flex flex-col items-start gap-6 md:max-w-md"
            >
              <p className="font-display text-2xl leading-[1.1] text-cream md:text-4xl">
                <span className="italic text-brass">{site.legacyYears}+</span> years of legacy.
              </p>
              <LinkButton href="#legacy">Learn more</LinkButton>
            </motion.div>
          </div>
        </div>

      </motion.div>
    </section>
  );
}
