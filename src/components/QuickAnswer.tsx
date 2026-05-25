/**
 * Quick Answer-blokk — strukturert "Top N"-svar rett under H1.
 *
 * Pattern destillert fra medcom-portal AEO grunnmur v3:
 * - 74% av AI-citations kommer fra listicle-format-innhold per industri-data
 * - Komponenten emiterer ItemList JSON-LD som matcher visuell rangering
 * - aria-label "Kort fortalt:" matcher CSS-selektoren i WebPage Speakable
 *   schema (se index.html + prerender), så det dobler som
 *   voice-assistant-readable content
 */
export interface QuickAnswerPoint {
  name: string;
  description?: string;
}

interface QuickAnswerProps {
  points: QuickAnswerPoint[];
  label?: string;
  intro?: string;
  schemaName?: string;
  className?: string;
}

export function QuickAnswer({
  points,
  label = "Kort fortalt:",
  intro,
  schemaName,
  className = "",
}: QuickAnswerProps) {
  if (points.length === 0) return null;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: points.length,
    ...(schemaName ? { name: schemaName } : {}),
    itemListElement: points.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      ...(p.description ? { description: p.description } : {}),
    })),
  };

  return (
    <aside
      className={`my-8 border-l-2 border-accent pl-5 md:pl-6 ${className}`}
      aria-label={label}
    >
      <p className="eyebrow mb-3">{label}</p>
      {intro ? (
        <p className="mb-4 text-base italic leading-relaxed text-muted-foreground">
          {intro}
        </p>
      ) : null}
      <ol className="space-y-3">
        {points.map((p, i) => (
          <li key={i} className="flex gap-4 text-base leading-relaxed">
            <span
              aria-hidden="true"
              className="font-serif text-lg italic text-accent/80 leading-none w-6 shrink-0"
            >
              {i + 1}.
            </span>
            <span className="text-foreground/90">
              <strong className="font-semibold text-foreground">{p.name}</strong>
              {p.description ? (
                <span className="text-muted-foreground">. {p.description}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </aside>
  );
}
