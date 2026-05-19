import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { BUSINESS } from "@/data/business";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const fullChain = [{ label: "Hjem", href: "/" }, ...items];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullChain.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      item: `${BUSINESS.domain}${it.href}`,
    })),
  };

  return (
    <nav aria-label="Brødsmuler" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
        {fullChain.map((it, i) => {
          const isLast = i === fullChain.length - 1;
          return (
            <li key={it.href} className="flex items-center gap-1.5">
              {i === 0 ? (
                <Link
                  to={it.href}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                  aria-label="Til forsiden"
                >
                  <Home className="h-3.5 w-3.5" />
                </Link>
              ) : isLast ? (
                <span aria-current="page" className="text-foreground">
                  {it.label}
                </span>
              ) : (
                <Link to={it.href} className="hover:text-foreground">
                  {it.label}
                </Link>
              )}
              {!isLast && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </nav>
  );
}
