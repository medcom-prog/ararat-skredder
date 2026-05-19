import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { BUSINESS } from "@/data/business";
import { galleryCategories, galleryImages, type GalleryCategory } from "@/data/gallery";
import { cn } from "@/lib/utils";

type Filter = GalleryCategory | "alle";

export default function Galleri() {
  const [filter, setFilter] = useState<Filter>("alle");
  const [active, setActive] = useState<number | null>(null);

  const visible = useMemo(
    () =>
      filter === "alle"
        ? galleryImages
        : galleryImages.filter((img) => img.category === filter),
    [filter],
  );

  const open = (idx: number) => setActive(idx);
  const close = () => setActive(null);
  const prev = () =>
    setActive((i) => (i === null ? null : (i - 1 + visible.length) % visible.length));
  const next = () =>
    setActive((i) => (i === null ? null : (i + 1) % visible.length));

  return (
    <>
      <SEO
        title="Galleri — Verkstedet og lokalene"
        description="Bilder fra verkstedet og lokalene i Torggata 8: skreddersøm, sysøm, kundemøter, stoffvalg og fasaden. Bak håndverket hos Ararat Skredderi."
        canonical={BUSINESS.domain + "/galleri"}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            name: "Galleri — Ararat Skredderi",
            description: "Bilder fra verkstedet, kundemøter og lokalene i Torggata 8.",
            image: galleryImages.slice(0, 12).map((img) => ({
              "@type": "ImageObject",
              contentUrl: `${BUSINESS.domain}${img.src}`,
              description: img.alt,
            })),
          },
        ]}
      />

      <div className="container-wide pt-6">
        <Breadcrumbs items={[{ label: "Galleri", href: "/galleri" }]} />
      </div>

      <section className="container-wide pt-8 pb-8 md:pt-14 md:pb-10">
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">Galleri</p>
            <h1 className="mt-4 text-display-1 text-foreground">
              Bak{" "}
              <span className="font-serif font-medium italic text-accent">
                håndverket
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              Bilder fra verkstedet, kundemøter og lokalene i Torggata 8. Klikk
              på et bilde for å se det i full størrelse.
            </p>
          </div>
        </Reveal>

        {/* Category filter */}
        <div className="mt-10 flex flex-wrap gap-2">
          <FilterChip
            label="Alle"
            count={galleryImages.length}
            active={filter === "alle"}
            onClick={() => setFilter("alle")}
          />
          {galleryCategories.map((cat) => (
            <FilterChip
              key={cat.id}
              label={cat.label}
              count={galleryImages.filter((img) => img.category === cat.id).length}
              active={filter === cat.id}
              onClick={() => setFilter(cat.id)}
            />
          ))}
        </div>
      </section>

      {/* Image grid — masonry-like with mixed aspect ratios */}
      <section className="container-wide pb-24">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {visible.map((img, i) => (
            <button
              type="button"
              key={img.src}
              onClick={() => open(i)}
              className={cn(
                "group relative overflow-hidden rounded-xl bg-muted text-left",
                i % 7 === 0 ? "md:row-span-2 md:aspect-[3/4]" : "aspect-square",
              )}
              aria-label={`Vis ${img.alt} i full størrelse`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                width={img.width}
                height={img.height}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-navy-dark/0 transition-colors group-hover:bg-navy-dark/30" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-navy-dark/85 to-transparent p-3 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-xs leading-snug text-white line-clamp-2">
                  {img.alt}
                </p>
              </div>
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Ingen bilder i denne kategorien ennå.
          </p>
        ) : null}
      </section>

      {/* Lightbox */}
      <Dialog.Root open={active !== null} onOpenChange={(o) => !o && close()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-dark/95 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <Dialog.Title className="sr-only">
              {active !== null ? visible[active]?.alt : "Galleribilde"}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Galleribilde fra Ararat Skredderi
            </Dialog.Description>
            {active !== null && visible[active] ? (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 md:left-8"
                  aria-label="Forrige bilde"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <img
                  src={visible[active].src}
                  alt={visible[active].alt}
                  width={visible[active].width}
                  height={visible[active].height}
                  className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
                />
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 md:right-8"
                  aria-label="Neste bilde"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <Dialog.Close
                  className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 md:right-8 md:top-8"
                  aria-label="Lukk"
                >
                  <X className="h-6 w-6" />
                </Dialog.Close>
                <div className="absolute inset-x-0 bottom-8 text-center text-sm text-white/70">
                  <p>{visible[active].alt}</p>
                  <p className="mt-1 font-mono text-xs">
                    {active + 1} / {visible.length}
                  </p>
                </div>
              </>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "border-navy bg-navy text-white"
          : "border-border bg-background text-foreground hover:border-accent/40 hover:text-accent",
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs",
          active ? "bg-white/15" : "bg-muted text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}
