import { Phone } from "lucide-react";
import { BUSINESS } from "@/data/business";

/**
 * Sticky call-button — pinned bottom-right on every page.
 *
 * - Mobile: circular icon-only (saves space, doesn't obscure content)
 * - md+: expanded pill with phone number visible
 * - safe-area-inset padding for iOS notch / home indicator
 * - Subtle pulse-ring animation; disabled by prefers-reduced-motion
 *   (the keyframe sits in a media query in index.css)
 * - aria-label spelling out the action for screen-readers
 */
export function FloatingCallButton() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-end"
      style={{
        paddingRight: "max(1rem, env(safe-area-inset-right))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      <a
        href={`tel:${BUSINESS.contact.phoneE164}`}
        aria-label={`Ring Ararat Skredderi: ${BUSINESS.contact.phone}`}
        className="pointer-events-auto group relative inline-flex h-14 items-center justify-center gap-3 rounded-full bg-accent px-5 text-accent-foreground shadow-2xl shadow-accent/30 transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        {/* Pulse ring — decorative, fades under reduced-motion */}
        <span
          aria-hidden="true"
          className="floating-pulse absolute inset-0 -z-10 rounded-full bg-accent/60"
        />
        <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="hidden font-semibold text-sm tabular md:inline">
          {BUSINESS.contact.phone}
        </span>
      </a>
    </div>
  );
}
