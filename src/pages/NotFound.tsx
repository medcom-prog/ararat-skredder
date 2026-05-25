import { Link } from "react-router-dom";
import { ArrowRight, Home } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/data/business";

export default function NotFound() {
  return (
    <>
      <SEO
        title="Siden finnes ikke (404)"
        description="Beklager, denne siden finnes ikke. Gå tilbake til forsiden eller utforsk tjenestene våre."
        canonical={BUSINESS.domain + "/404"}
      />

      <section className="section">
        <div className="container-narrow text-center">
          <p className="eyebrow">404</p>
          <h1 className="mt-4 text-display-1 text-foreground">
            Siden
            <br />
            <span className="font-serif font-medium italic text-accent">
              finnes ikke
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base text-muted-foreground">
            Vi finner ikke siden du leter etter. Den er kanskje flyttet eller
            fjernet. Gå tilbake til forsiden eller utforsk tjenestene våre.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="primary" size="lg">
              <Link to="/">
                <Home className="h-4 w-4" />
                Til forsiden
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/tjenester">
                Se tjenester
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
