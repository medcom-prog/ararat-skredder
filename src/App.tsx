import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCallButton } from "@/components/FloatingCallButton";
// Forside is the landing page and owns the LCP hero. Eager-import it (not
// lazy) so the hero <img> renders in React's first commit instead of after
// a second chunk round-trip — the render delay was 51% of homepage LCP.
import Forside from "@/pages/Forside";

const Tjenester = lazy(() => import("@/pages/Tjenester"));
const Priser = lazy(() => import("@/pages/Priser"));
const SkomakerOslo = lazy(() => import("@/pages/SkomakerOslo"));
const Galleri = lazy(() => import("@/pages/Galleri"));
const OmOss = lazy(() => import("@/pages/OmOss"));
const Kontakt = lazy(() => import("@/pages/Kontakt"));
const Personvern = lazy(() => import("@/pages/Personvern"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const BlogRouter = lazy(() =>
  import("./blog/BlogRouter").then((m) => ({ default: m.BlogRouter })),
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="container-narrow section min-h-screen">
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Forside />} />
            <Route path="/tjenester" element={<Tjenester />} />
            <Route path="/priser" element={<Priser />} />
            <Route path="/skomaker-oslo" element={<SkomakerOslo />} />
            <Route path="/galleri" element={<Galleri />} />
            <Route path="/om-oss" element={<OmOss />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/personvern" element={<Personvern />} />
            <Route path="/blog/*" element={<BlogRouter />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <FloatingCallButton />
    </div>
  );
}
