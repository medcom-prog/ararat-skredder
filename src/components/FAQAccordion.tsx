import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/data/faqs";

interface FAQAccordionProps {
  items: FAQ[];
  /** Optional schema name — set when this is the only FAQ on the page so
   *  it doesn't double-emit with other FAQ schemas. */
  emitSchema?: boolean;
}

export function FAQAccordion({ items, emitSchema = true }: FAQAccordionProps) {
  if (items.length === 0) return null;

  const schema = emitSchema
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((it) => ({
          "@type": "Question",
          name: it.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: it.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <Accordion.Root type="single" collapsible className="divide-y divide-border">
        {items.map((it, i) => (
          <Accordion.Item key={i} value={`item-${i}`} className="py-2">
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 py-4 text-left font-medium text-foreground hover:text-accent">
                <span className="text-base md:text-lg">{it.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-accent"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-fade-in">
              <p className="pb-5 pr-9 text-base leading-relaxed text-muted-foreground">
                {it.answer}
              </p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </>
  );
}
