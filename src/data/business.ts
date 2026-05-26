/**
 * Single source of truth for Ararat Skredderi business data.
 * Used by:
 * - Schema injection (index.html static + per-route prerender)
 * - Components (Header, Footer, Kontakt page)
 * - llms.txt generation
 *
 * Update here and downstream usage stays consistent.
 */

export const BUSINESS = {
  name: "Ararat Skredderi",
  legalName: "Ararat Skredder, Renseri, Skomaker, Nøkkel Filling, Ahmad Abdulhamid",
  shortDescription:
    "Profesjonell skreddersøm, reparasjon, omforming og skomakeri i Oslo sentrum.",
  longDescription:
    "Ararat Skredderi i Torggata 8 har levert profesjonell skreddersøm og reparasjon i Oslo i over 50 år. Vi tar målsøm av dresser, endringer og reparasjon, omforming av plagg, skjorter og bluser, samt skomakeri og spesialbestillinger til bryllup, scene og uniform.",
  established: 1974, // 50+ års erfaring per nettsiden
  orgNumber: "989361244",
  orgType: "ENK" as const,
  founder: {
    name: "Ahmad Abdulhamid",
    title: "Skreddermester",
    bio: "Skreddermester med over 50 års erfaring innen håndverkstradisjon, målsøm, klesreparasjon og skomakeri.",
    knowsAbout: [
      "Skreddersøm",
      "Målsøm av dresser",
      "Klesreparasjon",
      "Omforming av plagg",
      "Skomakeri",
      "Brudeplagg",
    ],
  },
  address: {
    street: "Torggata 8",
    postalCode: "0181",
    city: "Oslo",
    region: "Oslo",
    country: "Norge",
    countryCode: "NO" as const,
    geo: { lat: 59.9168, lng: 10.7497 },
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ararat+Skredderi+Torggata+8+Oslo",
  },
  contact: {
    phone: "+47 91 92 19 08",
    phoneE164: "+4791921908",
    phoneAlt: "+47 48 18 85 52",
    email: "ararat_skredder@hotmail.com",
  },
  hours: [
    { days: "Mandag – fredag", open: "10:00", close: "19:00" },
    { days: "Lørdag", open: "10:00", close: "18:00" },
    { days: "Søndag", open: null, close: null, closed: true },
  ] as Array<{ days: string; open: string | null; close: string | null; closed?: boolean }>,
  social: {
    instagram: "https://www.instagram.com/araratskredderofficial/",
    tiktok: "https://www.tiktok.com/@ararat.skredderof",
  },
  authority: {
    brreg: "https://www.brreg.no/enhet/989361244",
    proff:
      "https://www.proff.no/selskap/ararat-skredder-renseri-skomaker-n%C3%B8kkel-filling-ahmad-abdulhamid/oslo/skreddere/IFW7L9D02J9",
    nr1881: "https://www.1881.no/Ararat-Skredder/E6F94AAB7E994B26ABE0EAEAFA02D9DD/",
  },
  priceRange: "500-15000 NOK",
  domain: "https://www.araratskredderi.no",
  languages: ["Norwegian", "English", "Arabic"],
};

export const yearsExperience = new Date().getFullYear() - BUSINESS.established;
