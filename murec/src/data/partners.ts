export type Partner = {
  name: string;
  portrait: string;
  logo: string;
  logoAlt: string;
  quote: string;
};

export const partners: Partner[] = [
  {
    name: "Bobby Mukherji",
    portrait: "/partners/bobby-mukherji.webp",
    logo: "/associations/bobby-mukherji-architects.webp",
    logoAlt: "Bobby Mukherji Architects",
    quote:
      "We are engaged to conceptualize the interiors for Murec’s clubhouse and tower lobbies, with a focus on refined luxury and strong spatial identity.",
  },
  {
    name: "Goonmeet Ji",
    portrait: "/partners/goonmeet-singh-chauhan.webp",
    logo: "/associations/design-forum-international.webp",
    logoAlt: "Design Forum International",
    quote:
      "We are engaged to sculpt the architectural vision for Murec as a contemporary residential landmark, an address conceived for refined urban living, where design elegance is thoughtfully interwoven with functional planning to shape a premium high-rise environment of enduring character and aspiration.",
  },
];

export const associations: string[] = ["IGBC"];
