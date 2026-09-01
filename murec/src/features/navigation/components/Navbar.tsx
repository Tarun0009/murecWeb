"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@data/site";
import { cn } from "@shared/lib/cn";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 32);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ["top", ...site.nav.map((item) => item.href.slice(1))];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-25% 0px -55%", threshold: [0, 0.2, 0.5, 0.75] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled ? "glass-nav" : "bg-transparent"
        )}
      >
        <div className="container-page flex h-16 items-center justify-between md:h-20">
          <a href="#top" aria-label={site.brand} className="flex items-center leading-none">
            <Image
              src="/brand/murec-logo.webp"
              alt={site.brand}
              width={120}
              height={120}
              priority
              className="h-10 w-auto md:h-12"
            />
          </a>

          <nav className="hidden items-center gap-10 md:flex">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={activeSection === item.href.slice(1) ? "location" : undefined}
                className={cn(
                  "group relative text-[12px] uppercase tracking-[0.24em] transition-colors hover:text-cream",
                  activeSection === item.href.slice(1) ? "text-cream" : "text-cream/70"
                )}
              >
                {item.label}
                <span className={cn(
                  "absolute -bottom-2 left-0 h-px bg-brass transition-all duration-500 group-hover:w-full",
                  activeSection === item.href.slice(1) ? "w-full" : "w-0"
                )} />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.25 md:hidden"
            >
              <span
                className={cn(
                  "block h-px w-6 bg-cream transition-transform duration-300",
                  open && "translate-y-0.75 rotate-45"
                )}
              />
              <span
                className={cn(
                  "block h-px w-6 bg-cream transition-transform duration-300",
                  open && "-translate-y-0.75 -rotate-45"
                )}
              />
            </button>
          </div>
        </div>
        <div className="hairline h-px w-full border-t" />
        <div
          aria-hidden
          className="absolute bottom-0 left-0 h-px origin-left bg-brass"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-24 md:hidden"
          >
            <div className="container-page flex flex-col gap-6 pt-12">
              {site.nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-5xl leading-none text-cream"
                >
                  {item.label}
                </motion.a>
              ))}
              <div className="mt-8 border-t border-cream/10 pt-8 text-sm text-cream/60">
                <div>{site.email}</div>
                <div>{site.phone}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {scrolled && (
          <motion.a
            href="#top"
            aria-label="Back to top"
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.94 }}
            className="fixed bottom-5 right-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-brass/40 bg-ink/80 text-lg text-brass shadow-lg backdrop-blur-md transition-colors hover:border-brass hover:bg-ink md:bottom-7 md:right-7"
          >
            <span aria-hidden>↑</span>
          </motion.a>
        )}
      </AnimatePresence>
    </>
  );
}
