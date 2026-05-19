import type { LucideIcon } from "lucide-react";
import { Scissors, Shirt, Wand2, RefreshCcw, Footprints, Sparkles } from "lucide-react";

export interface ServiceProcessStep {
  step: string;
  description: string;
}

export interface ServicePricing {
  /** Numeric lowest price in NOK (for Offer schema). null = quote-only. */
  from: number | null;
  /** Display label */
  label: string;
  /** Optional note shown below price */
  note?: string;
}

export interface Service {
  slug: string;
  icon: LucideIcon;
  title: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  process: ServiceProcessStep[];
  pricing: ServicePricing;
  /** Used by ItemList schema for "Top N" quick answer */
  quickAnswerPoints: { name: string; description?: string }[];
}

export const services: Service[] = [
  {
    slug: "malsom-dresser",
    icon: Shirt,
    title: "Målsøm av dresser",
    shortDescription:
      "Eleganse skreddersydd etter dine mål. Klassisk håndverk for en perfekt passform.",
    fullDescription:
      "Vi skreddersyr elegante dresser etter dine mål og preferanser. En grundig prosess gir perfekt passform og en stil som matcher både personlighet og anledning — fra konsultasjon og måltaking til prøving og finjustering.",
    features: [
      "Nøyaktig måltaking og personlig konsultasjon",
      "Premium stoffvalg: ull, lin, silke",
      "Klassisk og moderne snitt",
      "Prøving og tilpasning underveis",
    ],
    process: [
      { step: "Konsultasjon", description: "Diskuter preferanser og behov med en erfaren skredder." },
      { step: "Måltaking", description: "Nøyaktige kroppsmål for skreddersydd passform." },
      { step: "Designvalg", description: "Stoff, snitt og detaljer som passer din stil." },
      { step: "Prøving og tilpasning", description: "Finjustering for maksimal komfort." },
    ],
    pricing: { from: 8000, label: "Fra 8 000 kr", note: "Avhenger av stoff og kompleksitet" },
    quickAnswerPoints: [
      { name: "Personlig konsultasjon før måltaking", description: "Vi forstår anledning og personlig stil før vi løfter målbåndet." },
      { name: "Premium stoff og presisjonshåndverk", description: "Ull, lin og silke kombinert med klassisk håndverkstradisjon." },
      { name: "Prøving og finjustering inkludert", description: "Vi tar deg gjennom en eller flere prøvinger til passformen er perfekt." },
      { name: "Leveringstid 2 – 4 uker", description: "Avhenger av kompleksitet og stoffvalg." },
    ],
  },
  {
    slug: "endringer-reparasjon",
    icon: Scissors,
    title: "Endringer & reparasjon",
    shortDescription:
      "Plaggene dine fortjener et lengre liv. Vi gjør dem som nye.",
    fullDescription:
      "Vi utfører endringer og reparasjoner som får plaggene til å sitte bedre og vare lenger — fra enkle justeringer til komplekse jobber. Bukser, skjørt, ermer, knapper, glidelåser og alt der imellom.",
    features: [
      "Lengdejustering av bukser, skjørt og ermer",
      "Inn- og uttak for justert passform",
      "Reparasjon av rifter, hull og slitasje",
      "Glidelåser og knapper byttes raskt",
    ],
    process: [
      { step: "Innlevering", description: "Kom innom Torggata 8 — vi vurderer plagget på stedet." },
      { step: "Prisoverslag", description: "Konkret pris og leveringstid før vi setter i gang." },
      { step: "Håndverk", description: "Erfarne skreddere utfører arbeidet med presisjon." },
      { step: "Henting", description: "Plagget klart til avtalt tid — pakket og pent." },
    ],
    pricing: { from: 200, label: "Fra 200 kr", note: "Pris settes etter vurdering på stedet" },
    quickAnswerPoints: [
      { name: "Drop-in-vurdering på stedet", description: "Kom innom uten avtale — vi gir prisoverslag mens du venter." },
      { name: "Lengdejustering 200 – 400 kr", description: "Bukser, skjørt og ermer." },
      { name: "Glidelås og knapper byttes raskt", description: "Vanligvis ferdig innen 1 – 3 dager." },
      { name: "Større reparasjoner får eget prisoverslag", description: "Komplekse jobber prises individuelt." },
    ],
  },
  {
    slug: "omforming",
    icon: Wand2,
    title: "Omforming av plagg",
    shortDescription:
      "Gi gamle favoritter et nytt liv. Vi gjør om snitt, fasong og detaljer.",
    fullDescription:
      "Har du et plagg du elsker som ikke lenger passer eller føles utdatert? Vi gir det nytt liv — oppgradering av snitt, fasong eller detaljer for et moderne uttrykk uten å miste det som gjorde plagget spesielt i utgangspunktet.",
    features: [
      "Gammel dress → moderne blazer",
      "Lang kjole → tidløs midikjole",
      "For stor skjorte → skreddersydd passform",
      "Arvestykker fornyet med varsomhet",
    ],
    process: [
      { step: "Konsept", description: "Vi diskuterer hva plagget skal bli." },
      { step: "Skisse og pris", description: "Forslag på endringer + bindende prisoverslag." },
      { step: "Omforming", description: "Håndverket utføres med respekt for originalstoffet." },
      { step: "Tilpasning", description: "Endelig prøving for perfekt passform." },
    ],
    pricing: { from: null, label: "Pris etter vurdering", note: "Vurderes individuelt etter kompleksitet" },
    quickAnswerPoints: [
      { name: "Arvestykker håndteres varsomt", description: "Vi forstår sentimental verdi og jobber deretter." },
      { name: "Skisse + bindende pris før vi starter", description: "Ingen overraskelser." },
      { name: "Typisk leveringstid 2 – 5 uker", description: "Avhenger av kompleksitet og stofftype." },
    ],
  },
  {
    slug: "skjorter-bluser",
    icon: Shirt,
    title: "Skjorter & bluser",
    shortDescription:
      "Skreddersydde skjorter med perfekt passform. Velg stoff, krage og detaljer.",
    fullDescription:
      "Skreddersydde skjorter og bluser med perfekt passform. Du velger stoff, krage, mansjett og alle detaljer — fra premium bomull til silke, sateng, lin og tekniske stoffer.",
    features: [
      "Premium bomull, silke, sateng, lin",
      "Klassisk og moderne kragesnitt",
      "Måltatt passform — ikke standardstørrelser",
      "Skreddersydde for kontor, fest eller hverdag",
    ],
    process: [
      { step: "Stoffvalg", description: "Vi viser deg utvalget — fra hverdagsbomull til premiumsilke." },
      { step: "Måltaking", description: "Nøyaktige mål for skuldre, bryst, midje og lengde." },
      { step: "Søm", description: "Skjorten/blusen sys på bestilling i vårt verksted." },
      { step: "Prøving", description: "Endelig prøving for perfekt passform." },
    ],
    pricing: { from: 2500, label: "Fra 2 500 kr", note: "Avhenger av stoff og design" },
    quickAnswerPoints: [
      { name: "Premium stoffvalg fra silke til lin", description: "Vi har bredt utvalg på stedet." },
      { name: "Krage og mansjett-design tilpasset", description: "Klassiske og moderne alternativer." },
      { name: "Måltatt passform, ingen S/M/L-kompromiss", description: "Skjorten sitter slik den skal." },
      { name: "Leveringstid 2 – 3 uker", description: "Raskere ved enkel design." },
    ],
  },
  {
    slug: "skomakeri",
    icon: Footprints,
    title: "Skomakeri",
    shortDescription:
      "Sko som varer lenger. Reparasjon av såler, hæler, skinn og glidelåser.",
    fullDescription:
      "Vi utfører alle typer skoreparasjoner — skinn, tekstil og syntet. Kom innom for vurdering. Spesialitet på reparasjon av arvede sko og høykvalitetsmodeller som fortjener et nytt liv.",
    features: [
      "Sålereparasjon og utskifting",
      "Hælreparasjon og utskifting",
      "Lapping og fiks av rifter i skinn",
      "Reparasjon og utskifting av glidelåser på støvler",
    ],
    process: [
      { step: "Vurdering", description: "Drop-in for vurdering og prisoverslag." },
      { step: "Materialvalg", description: "Riktig såle eller hæl etter skoens kvalitet og bruk." },
      { step: "Reparasjon", description: "Utføres på verkstedet vårt." },
      { step: "Henting", description: "Klart på avtalt tid." },
    ],
    pricing: { from: 300, label: "Fra 300 kr", note: "Avhenger av skotype og reparasjon" },
    quickAnswerPoints: [
      { name: "Drop-in-vurdering på stedet", description: "Kom innom uten avtale." },
      { name: "Sålereparasjon fra 400 kr", description: "Også utskifting av hele såler." },
      { name: "Arvede og premiumsko håndteres varsomt", description: "Vi forstår verdien av kvalitetssko." },
      { name: "Vanligvis ferdig innen 3 – 7 dager", description: "Avhenger av reservedeler og kompleksitet." },
    ],
  },
  {
    slug: "spesialbestillinger",
    icon: Sparkles,
    title: "Spesialbestillinger",
    shortDescription:
      "Brudeplagg, kostymer, uniformer og designsamarbeid. Vi tar utfordrende prosjekter.",
    fullDescription:
      "Har du en idé eller et spesielt behov? Vi tar utfordrende prosjekter og spesialbestillinger — brudekjoler og brudgomsdresser, kostymer for teater og film, profesjonelle uniformer og samarbeid med merker og designere.",
    features: [
      "Brudekjoler og brudgomsdresser",
      "Kostymer for teater, film og event",
      "Profesjonelle og seremonielle uniformer",
      "Samarbeid med merker og designere",
    ],
    process: [
      { step: "Konsept-møte", description: "Vi diskuterer visjon, budsjett og tidsramme." },
      { step: "Skisse + tilbud", description: "Konkret forslag med pris og leveringsplan." },
      { step: "Produksjon", description: "Iterativ produksjon med prøvinger underveis." },
      { step: "Levering", description: "Endelig prøving før overlevering." },
    ],
    pricing: { from: null, label: "Etter avtale", note: "Vurderes individuelt etter prosjekt" },
    quickAnswerPoints: [
      { name: "Brude- og brudgomsplagg", description: "Skreddersydd for den viktigste dagen." },
      { name: "Teater og film-kostymer", description: "Erfaring med produksjons-deadlines." },
      { name: "Designsamarbeid for merker", description: "Vi tar tekniske, materielle og kreative utfordringer." },
      { name: "Konsept-møte er kostnadsfritt", description: "Vi prises kun bindende etter klare spesifikasjoner." },
    ],
  },
] satisfies Service[];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
