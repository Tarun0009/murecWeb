"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type DepthCarouselItem = string | {
  image: string;
  alt?: string;
  surface?: "light" | "dark";
  imageClassName?: string;
  cropLeftArtwork?: boolean;
};

type Props = {
  items: DepthCarouselItem[];
  cardWidth?: number;
  cardHeight?: number;
  depth?: number;
  spread?: number;
  tilt?: number;
  perspective?: number;
  className?: string;
  scrollDriven?: boolean;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function DepthCarousel({
  items,
  cardWidth = 280,
  cardHeight = 180,
  depth = 190,
  spread = 76,
  tilt = 18,
  perspective = 1400,
  className = "",
  scrollDriven = false,
}: Props) {
  const data = useMemo(
    () => items.map((item) => (typeof item === "string" ? { image: item, alt: "", surface: "dark" as const } : item)),
    [items]
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const position = useRef(0);
  const drag = useRef<{ x: number; start: number; id: number; moved: boolean } | null>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const layout = useCallback((current: number) => {
    data.forEach((_, index) => {
      const card = cardRefs.current[index];
      if (!card) return;
      const distance = index - current;
      const behind = Math.max(0, distance);
      const opacity = distance < 0 ? Math.max(0, 1 + distance) : Math.abs(distance) > 4.5 ? 0 : 1;
      const scale = Math.max(0.72, 1 - behind * 0.055);
      const isFront = Math.abs(distance) < 0.5;
      card.style.transform = `translate(-50%, -50%) translateX(${distance * spread}px) translateZ(${-distance * depth}px) rotateY(${clamp(distance, 0, 1) * tilt}deg) scale(${scale})`;
      card.style.opacity = String(opacity);
      card.style.filter = `brightness(${Math.max(0.58, 1 - behind * 0.11)})`;
      card.style.borderColor = isFront ? "rgba(185, 145, 74, 0.72)" : "rgba(185, 145, 74, 0.24)";
      card.style.boxShadow = isFront
        ? "0 38px 100px -28px rgba(0,0,0,0.82), 0 0 42px rgba(185,145,74,0.12), inset 0 1px 0 rgba(255,255,255,0.82)"
        : "0 28px 70px -30px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.55)";
      card.style.zIndex = String(Math.round(1000 - distance * 20));
      card.style.pointerEvents = opacity > 0.1 ? "auto" : "none";
    });
  }, [data, depth, spread, tilt]);

  const goTo = useCallback((index: number) => {
    const next = clamp(index, 0, data.length - 1);
    tween.current?.kill();
    const proxy = { value: position.current };
    tween.current = gsap.to(proxy, {
      value: next,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.62,
      ease: "power3.out",
      onUpdate: () => {
        position.current = proxy.value;
        layout(proxy.value);
      },
    });
    activeRef.current = next;
    setActive(next);
  }, [data.length, layout]);

  useEffect(() => {
    layout(0);
    return () => {
      tween.current?.kill();
    };
  }, [layout]);

  useEffect(() => {
    const root = rootRef.current;
    const section = root?.closest("section");
    if (!scrollDriven || !root || !section || data.length < 2) return;

    const media = gsap.matchMedia();
    const createScrollTimeline = (pinSection: boolean) => {
      const proxy = { value: 0 };
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${(data.length - 1) * 100}%`,
          pin: pinSection ? section : false,
          pinSpacing: pinSection,
          anticipatePin: pinSection ? 1 : 0,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(proxy, {
        value: data.length - 1,
        duration: data.length - 1,
        ease: "none",
        onUpdate: () => {
          const nextActive = Math.round(proxy.value);
          position.current = proxy.value;
          layout(proxy.value);
          if (nextActive !== activeRef.current) {
            activeRef.current = nextActive;
            setActive(nextActive);
          }
        },
      });

      return () => timeline.kill();
    };

    media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () =>
      createScrollTimeline(false)
    );
    media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () =>
      createScrollTimeline(true)
    );

    ScrollTrigger.refresh();
    return () => media.revert();
  }, [data.length, layout, scrollDriven]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: event.clientX, start: position.current, id: event.pointerId, moved: false };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const delta = event.clientX - drag.current.x;
    if (Math.abs(delta) > 4 && !drag.current.moved) {
      drag.current.moved = true;
      rootRef.current?.setPointerCapture(drag.current.id);
    }
    if (!drag.current.moved) return;
    position.current = clamp(drag.current.start - delta / 150, 0, data.length - 1);
    layout(position.current);
  };

  const onPointerEnd = () => {
    if (!drag.current) return;
    const moved = drag.current.moved;
    drag.current = null;
    if (moved) goTo(Math.round(position.current));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") goTo(active - 1);
    if (event.key === "ArrowRight") goTo(active + 1);
  };

  return (
    <div
      ref={rootRef}
      className={`relative min-h-[360px] w-full cursor-grab touch-pan-y select-none outline-none active:cursor-grabbing ${className}`}
      style={{ perspective }}
      role="group"
      aria-roledescription="carousel"
      aria-label="Association logos"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      <div className="absolute inset-0 [transform-style:preserve-3d]">
        {data.map((item, index) => (
          <button
            key={item.image}
            ref={(element) => { cardRefs.current[index] = element; }}
            type="button"
            aria-label={`${item.alt || "Association"}, ${index + 1} of ${data.length}`}
            aria-current={active === index}
            onClick={() => goTo(index)}
            className={`absolute left-1/2 top-1/2 overflow-hidden border border-brass/25 shadow-[0_35px_90px_-24px_rgba(0,0,0,0.72),inset_0_1px_0_rgba(255,255,255,0.12)] [transform:translate(-50%,-50%)] [transform-origin:center] [transform-style:preserve-3d] [will-change:transform,opacity,filter] ${item.surface === "light" ? "bg-[#e8e2d6]" : "bg-[#090a09]"}`}
            style={{ width: `min(${cardWidth}px, calc(100vw - 48px))`, height: cardHeight }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.alt || ""}
              draggable={false}
              className={`${item.cropLeftArtwork
                ? "absolute left-[26%] top-1/2 !h-[calc(100%-32px)] !w-auto max-w-none -translate-y-1/2 object-contain p-0"
                : "h-full w-full object-contain p-3 sm:p-4"
              } [image-rendering:auto] ${item.surface === "light" ? "mix-blend-multiply" : ""} ${item.imageClassName ?? ""}`}
            />
            <span className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/8 via-transparent to-brass/8" />
          </button>
        ))}
      </div>

      <button type="button" aria-label="Previous association" onClick={() => goTo(active - 1)} className="absolute bottom-2 left-1/2 z-[2000] -translate-x-16 text-2xl text-cream/55 transition-colors hover:text-brass">←</button>
      <button type="button" aria-label="Next association" onClick={() => goTo(active + 1)} className="absolute bottom-2 left-1/2 z-[2000] translate-x-12 text-2xl text-cream/55 transition-colors hover:text-brass">→</button>
      <div className="absolute bottom-3 left-1/2 z-[1999] flex -translate-x-1/2 gap-1.5">
        {data.map((item, index) => (
          <button key={item.image} type="button" aria-label={`Go to association ${index + 1}`} onClick={() => goTo(index)} className={`h-1.5 rounded-full transition-all ${active === index ? "w-5 bg-brass" : "w-1.5 bg-cream/25"}`} />
        ))}
      </div>
    </div>
  );
}
