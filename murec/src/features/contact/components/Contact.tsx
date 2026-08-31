"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Section } from "@shared/components/Section";
import { Eyebrow } from "@shared/components/Eyebrow";
import { Reveal } from "@shared/components/Reveal";
import { LinkButton } from "@shared/components/LinkButton";
import { site } from "@data/site";
import { ease } from "@shared/lib/motion";

type Status = "idle" | "sending" | "sent";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");
    window.setTimeout(() => setStatus("sent"), 900);
  };

  return (
    <Section id="contact" scene="contact" className="border-t border-cream/10">
      <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-16 lg:gap-20">
        <div className="flex flex-col gap-7 md:gap-8">
          <Eyebrow index="06">Get in touch</Eyebrow>
          <Reveal>
            <h2 className="font-display text-5xl leading-[1.02] text-cream md:text-7xl">
              Contact <span className="italic text-brass">us</span>.
            </h2>
          </Reveal>

          <Reveal>
            <div className="mt-2 flex flex-col gap-7 border-t border-cream/10 pt-7 md:mt-4 md:gap-8 md:pt-8">
              <div>
                <div className="eyebrow mb-2">Studio</div>
                <address className="not-italic text-base leading-relaxed text-cream/85">
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                  <br />
                  {site.address.postal}
                </address>
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <div className="eyebrow mb-2">Email</div>
                  <a href={`mailto:${site.email}`} className="text-cream hover:text-brass">
                    {site.email}
                  </a>
                </div>
                <div>
                  <div className="eyebrow mb-2">Phone</div>
                  <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className="text-cream hover:text-brass">
                    {site.phone}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease }}
          className="glass-surface flex w-full max-w-lg flex-col gap-6 justify-self-end p-5 sm:p-6 md:p-7 lg:p-8"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
            <Field label="Full name" name="name" required />
            <Field label="Email" name="email" type="email" required />
          </div>
          <Field label="Phone" name="phone" type="tel" />
          <Field
            label="What can we help with?"
            name="message"
            textarea
            required
          />

          <div className="mt-2 flex flex-col items-start gap-5 border-t border-cream/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-cream/50">
              {status === "sent"
                ? "Thank you. We will be in touch shortly."
                : "We respond within one business day."}
            </span>
            <LinkButton variant="solid">
              {status === "sending" ? "Sending" : status === "sent" ? "Sent" : "Send enquiry"}
            </LinkButton>
          </div>
        </motion.form>
      </div>
    </Section>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
};

function Field({ label, name, type = "text", required, textarea }: FieldProps) {
  const base =
    "peer w-full border-0 border-b border-cream/20 bg-transparent px-0 pb-3 pt-7 text-[15px] leading-6 text-cream placeholder-transparent transition-colors duration-300 focus:border-brass focus:outline-none focus:ring-0";

  return (
    <label className="group relative flex flex-col">
      {textarea ? (
        <textarea
          name={name}
          required={required}
          placeholder={label}
            rows={2}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={label}
          className={base}
        />
      )}
      <span className="pointer-events-none absolute left-0 top-7 origin-left text-sm text-cream/50 transition-all duration-300 peer-focus:top-1 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-brass peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.18em] peer-[:not(:placeholder-shown)]:text-cream/70">
        {label}
      </span>
    </label>
  );
}
