"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FooterWaterScene = dynamic(() => import("./FooterWaterScene"), { ssr: false });

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const trigger = ScrollTrigger.create({
      trigger: footer,
      start: "top bottom",
      end: "bottom bottom",
      scrub: 0.12,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        scrollRef.current = self.progress;
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <footer ref={footerRef} className="relative isolate overflow-hidden border-t border-cream/10 bg-[#050706]">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-80">
        <FooterWaterScene scrollRef={scrollRef} />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-linear-to-b from-[#050706]/60 via-[#050706]/72 to-[#050706]" />

      <div className="container-page relative z-10 py-16 md:py-20">
        <h2 className="font-display text-3xl uppercase tracking-[0.04em] text-cream md:text-4xl">The MUREC Team</h2>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-[1.45fr_0.75fr_0.75fr] md:gap-12">
          <FooterItem icon={<LocationIcon />} label="Corporate Address:">
            <address className="not-italic">
              Madhusudan, 2nd Floor, Riana Towers, 51-52,
              <br />
              Noida Sector 136, Uttar Pradesh - 201301
            </address>
          </FooterItem>
          <FooterItem icon={<MailIcon />} label="Email">
            <a href="mailto:info@murec.com" className="transition-colors hover:text-brass">info@murec.com</a>
          </FooterItem>
          <FooterItem icon={<PhoneIcon />} label="Phone Number">
            <a href="tel:+919717773229" className="transition-colors hover:text-brass">+91 97177 73229</a>
          </FooterItem>
        </div>

        <p className="mt-16 max-w-none text-sm leading-[1.75] text-cream/72 md:mt-24 md:text-base">
          This website is purely conceptual and not a legal document. All layouts, specifications, amenities, and
          visuals are subject to change as may be decided by MUREC or the competent authority. No information herein
          shall be construed as an offer, solicitation, or invitation to purchase. Interested parties are requested
          to verify all details, including approvals, specifications, and prices, directly with MUREC before making
          any commitments.
        </p>
      </div>

      <div className="relative z-10 border-t border-cream/10 bg-cream/[0.07]">
        <div className="container-page flex flex-col gap-4 py-5 text-xs text-cream/75 sm:flex-row sm:items-center sm:justify-between">
          <span>Powered by Propacity</span>
          <span>Copyright © 2026 | Privacy Policy</span>
          <div className="flex gap-3" aria-label="Social media">
            <SocialMark href="https://www.facebook.com/profile.php?id=61586724462166" label="Facebook">
              <FacebookIcon />
            </SocialMark>
            <SocialMark href="https://www.youtube.com/@Murec_official" label="YouTube">
              <YouTubeIcon />
            </SocialMark>
            <SocialMark href="https://www.instagram.com/murec_official/" label="Instagram">
              <InstagramIcon />
            </SocialMark>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterItem({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-4 text-cream">
      <span className="mt-0.5 shrink-0 text-cream/90">{icon}</span>
      <div className="text-sm leading-relaxed md:text-base">
        <div className="uppercase text-cream/90">{label}</div>
        <div className="text-cream/75">{children}</div>
      </div>
    </div>
  );
}

function SocialMark({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="grid size-8 place-items-center rounded-full border border-cream/60 text-cream transition-colors hover:border-brass hover:text-brass"
    >
      {children}
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.7c0-.9.25-1.5 1.55-1.5H16.5V4.6c-.3-.05-1.3-.15-2.45-.15-2.4 0-4.05 1.45-4.05 4.15v2.4H7.5v3h2.5V21h3.5Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2c-.2-1-.9-1.8-1.9-2C17.8 4.8 12 4.8 12 4.8s-5.8 0-7.7.4c-1 .2-1.7 1-1.9 2C2 9.1 2 12 2 12s0 2.9.4 4.8c.2 1 .9 1.8 1.9 2 1.9.4 7.7.4 7.7.4s5.8 0 7.7-.4c1-.2 1.7-1 1.9-2 .4-1.9.4-4.8.4-4.8s0-2.9-.4-4.8ZM10 15.3V8.7l5.5 3.3-5.5 3.3Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const iconClass = "h-8 w-8";
function LocationIcon() {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" className={iconClass}><path d="M16 29s10-8 10-18a10 10 0 1 0-20 0c0 10 10 18 10 18Z"/><circle cx="16" cy="11" r="3"/></svg>;
}
function MailIcon() {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" className={iconClass}><rect x="2" y="6" width="28" height="20" rx="2"/><path d="m3 8 13 10L29 8"/></svg>;
}
function PhoneIcon() {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" className={iconClass}><path d="M9 3h4l2 7-3 2a22 22 0 0 0 8 8l2-3 7 2v4c0 3-2 6-6 6C12 28 4 20 3 9c0-4 3-6 6-6Z"/></svg>;
}
