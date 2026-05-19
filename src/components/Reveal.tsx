import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Delay in ms before the animation runs after the element enters the viewport */
  delay?: number;
  /** Override the wrapping element. Default: div */
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

/**
 * Mounts children with a subtle fade-up animation when scrolled into view.
 *
 * - Uses IntersectionObserver (one-shot, observer disconnects after reveal)
 * - Honors `prefers-reduced-motion` via .reveal-init styles in index.css
 *   (the CSS layer disables transitions for users who opted out)
 * - Default delay 0; pass 60–180ms to stagger neighboring elements
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // SSR/no-IO fallback: just show immediately
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as any;
  return (
    <Component
      ref={ref as any}
      className={cn("reveal-init", shown && "reveal-show", className)}
      style={delay && shown ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  );
}
