import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        border: "hsl(var(--border))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        navy: {
          DEFAULT: "hsl(var(--navy))",
          dark: "hsl(var(--navy-dark))",
        },
        // Brand legacy aliases for clarity in markup
        ink: "hsl(var(--navy-dark))",
        sky: "hsl(var(--accent))",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "system-ui", "sans-serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Poppins'", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Reduced from clamp(2.5, 7vw, 5.5) — was too dominant on desktop.
        // Caps at 4.5rem (72px) which still reads as hero without overwhelming.
        "hero": ["clamp(2rem, 5vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        "display": ["clamp(1.75rem, 3.8vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.005em" }],
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        sm: "calc(var(--radius) - 4px)",
        lg: "calc(var(--radius) + 4px)",
      },
      backgroundImage: {
        "accent-gradient":
          "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent-soft)) 100%)",
        "hero-overlay":
          "linear-gradient(180deg, rgba(10,26,58,0.65) 0%, rgba(10,26,58,0.35) 45%, rgba(10,26,58,0.85) 100%)",
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.5s ease-out",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [animate],
};

export default config;
