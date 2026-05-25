/**
 * Gallery image manifest. Categories let us build the filter pills on
 * /galleri. Alt-tekst is hand-written per image for accessibility and
 * AI image-understanding (Google Image SEO bonus).
 */
export type GalleryCategory = "skreddersom" | "verksted" | "lokaler" | "kunde" | "skomakeri";

export interface GalleryImage {
  /** File path relative to /images/gallery/ */
  src: string;
  alt: string;
  category: GalleryCategory;
  width: number;
  height: number;
}

const BASE = "/images/gallery";

export const galleryImages: GalleryImage[] = [
  {
    src: `${BASE}/araratironingshirt.jpg`,
    alt: "Ahmad presser en skjorte med dampjern på verkstedet",
    category: "skreddersom",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/araratironingshirt-2.jpg`,
    alt: "Detalj av Ahmad som presser kragen på en skjorte",
    category: "skreddersom",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/araratsowingwithmachine.jpg`,
    alt: "Ahmad syr på industri-symaskinen",
    category: "skreddersom",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/araratsowingwithmachine-2.jpg`,
    alt: "Sysøm i nærbilde, presisjon på symaskin",
    category: "skreddersom",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/araratsowingwithmachine-3.jpg`,
    alt: "Ahmad konsentrert ved symaskinen",
    category: "skreddersom",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/araratworkingwithmachine.jpg`,
    alt: "Ahmad arbeider på en sykkelfabrikk-symaskin",
    category: "verksted",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/araratworkingwithmachine-2.jpg`,
    alt: "Symaskin i bruk, kontroll over stinglengde",
    category: "verksted",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/araratmeasuringcustomerpants.jpg`,
    alt: "Ahmad måler buksebein på en kunde",
    category: "kunde",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/araratmeasuringcustomerpants-2.jpg`,
    alt: "Måltaking med målbånd langs siden",
    category: "kunde",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/sittingwithcustomer.jpg`,
    alt: "Konsultasjon med kunde i sittegruppe",
    category: "kunde",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/sittingwithcustomer-2.jpg`,
    alt: "Personlig kundekonsultasjon ved bordet",
    category: "kunde",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/pointingatfabric.jpg`,
    alt: "Ahmad viser stoffvalg til en kunde",
    category: "kunde",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/pointingatfabric-2.jpg`,
    alt: "Stoffvalg, gjennomgang av materialer",
    category: "kunde",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/araratstandingbehindcounter.jpg`,
    alt: "Ahmad bak disken i butikken",
    category: "lokaler",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/araratsittinginsittingarea.jpg`,
    alt: "Ahmad i sittegruppen i butikken",
    category: "lokaler",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/sittingarea.jpg`,
    alt: "Sittegruppen i Ararat Skredderi, Torggata 8",
    category: "lokaler",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/sittingarea2.jpg`,
    alt: "Interiør, venteområde med klassisk møblement",
    category: "lokaler",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/outsifeofshop.jpg`,
    alt: "Fasaden på Ararat Skredderi i Torggata 8",
    category: "lokaler",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/outsideofshop-2.jpg`,
    alt: "Inngangen til Ararat Skredderi fra gateplan",
    category: "lokaler",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/outsideofshop-3.jpg`,
    alt: "Skiltet til Ararat Skredderi",
    category: "lokaler",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/workstation.jpg`,
    alt: "Skredderens arbeidsstasjon med verktøy",
    category: "verksted",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/threads.jpg`,
    alt: "Trådhylle med fargesortiment",
    category: "verksted",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/somesupplies.jpg`,
    alt: "Skredderutstyr og tråd på verkstedet",
    category: "verksted",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/somesupplies-2.jpg`,
    alt: "Spoler og tråd organisert på hylle",
    category: "verksted",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/fabriccleanpicture.jpg`,
    alt: "Stoff lagt pent ut for syinspeksjon",
    category: "verksted",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/fabricontable.jpg`,
    alt: "Stoff klargjort på arbeidsbordet",
    category: "verksted",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/fabricslaidontable.jpg`,
    alt: "Flere stoffer lagt ut for valg",
    category: "verksted",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/clothesrack.jpg`,
    alt: "Klesstativ med ferdige plagg til henting",
    category: "verksted",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/araratdoingshoework.jpg`,
    alt: "Ahmad arbeider med skoreparasjon",
    category: "skomakeri",
    width: 1200,
    height: 1600,
  },
  {
    src: `${BASE}/shoemakesmachine.jpg`,
    alt: "Skomakermaskin i bruk på verkstedet",
    category: "skomakeri",
    width: 1200,
    height: 1600,
  },
];

export const galleryCategories: Array<{ id: GalleryCategory; label: string }> = [
  { id: "skreddersom", label: "Skreddersøm" },
  { id: "verksted", label: "Verksted" },
  { id: "kunde", label: "Kundemøte" },
  { id: "lokaler", label: "Lokaler" },
  { id: "skomakeri", label: "Skomakeri" },
];
