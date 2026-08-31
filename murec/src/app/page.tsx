import { Hero } from "@features/hero/components/Hero";
import { Legacy } from "@features/legacy/components/Legacy";
import { Principles } from "@features/principles/components/Principles";
import { Collection } from "@features/collection/components/Collection";
import { Philosophy } from "@features/philosophy/components/Philosophy";
import { Associations } from "@features/associations/components/Associations";
import { Partners } from "@features/partners/components/Partners";
import { Contact } from "@features/contact/components/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Legacy />
      <Principles />
      <Collection />
      <Philosophy />
      <Associations />
      <Partners />
      <Contact />
    </>
  );
}
