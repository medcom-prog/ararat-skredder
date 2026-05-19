export interface FAQ {
  question: string;
  answer: string;
}

/** Forsiden + Kontakt deler disse generelle FAQ-ene */
export const generalFaqs: FAQ[] = [
  {
    question: "Hvor finner jeg dere?",
    answer:
      "Vi holder til i Torggata 8, 0181 Oslo — midt i Oslo sentrum. Vi ligger nær flere bussholdeplasser og T-bane-stasjoner og er enkle å nå med offentlig transport.",
  },
  {
    question: "Må jeg bestille time?",
    answer:
      "Nei. Du kan komme innom uten avtale og få plagget vurdert mens du venter. For større prosjekter som målsøm av dress eller brudeplagg anbefaler vi å avtale tid på forhånd så vi setter av nok tid til konsultasjon.",
  },
  {
    question: "Hvor lang tid tar reparasjoner?",
    answer:
      "Enkle reparasjoner som lengdejustering eller glidelås tar 1–3 dager. Mer komplekse reparasjoner og omforminger tar 2–5 uker. Målsøm av dress: 2–4 uker fra måltaking til ferdig plagg.",
  },
  {
    question: "Hva koster det?",
    answer:
      "Reparasjoner starter fra 200 kr. Skreddersydde skjorter fra 2 500 kr. Målsøm av dress fra 8 000 kr. Vi gir alltid bindende prisoverslag før vi setter i gang — kom innom for vurdering.",
  },
  {
    question: "Kan dere reparere alle typer klær og sko?",
    answer:
      "Vi tar de fleste plagg og skotyper — fra hverdagsklær til premium og arvestykker. For helt spesielle materialer eller designerklær gir vi alltid en ærlig vurdering før vi tar oppdraget.",
  },
  {
    question: "Tilbyr dere hjemmebesøk?",
    answer:
      "For spesielle anledninger og større prosjekter som brudeplagg kan vi arrangere hjemmebesøk i Oslo-området. Kontakt oss for å avtale.",
  },
];

/** Kortere FAQ-utvalg for forsiden */
export const homeFaqs: FAQ[] = generalFaqs.slice(0, 5);
