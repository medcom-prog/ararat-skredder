import { useId, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BUSINESS } from "@/data/business";

const TOPICS = [
  "Målsøm av dress",
  "Endringer og reparasjon",
  "Omforming av plagg",
  "Skjorter og bluser",
  "Skomakeri",
  "Brudeplagg",
  "Spesialprosjekt",
  "Annet",
];

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const ids = {
    name: useId(),
    email: useId(),
    phone: useId(),
    topic: useId(),
    message: useId(),
    consent: useId(),
    hp: useId(),
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "loading") return;

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      topic: String(fd.get("topic") ?? ""),
      message: String(fd.get("message") ?? "").trim(),
      consent: fd.get("consent") === "on",
      honeypot: String(fd.get("website") ?? ""), // bots fill this
    };

    setStatus({ kind: "loading" });

    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await resp.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (resp.ok && data.ok) {
        setStatus({ kind: "success" });
        formRef.current?.reset();
        return;
      }

      setStatus({
        kind: "error",
        message:
          data.error ??
          "Noe gikk galt. Prøv igjen eller ring oss direkte på " +
            BUSINESS.contact.phone +
            ".",
      });
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          "Vi får ikke kontakt akkurat nå. Prøv igjen om litt eller ring oss på " +
          BUSINESS.contact.phone +
          ".",
      });
    }
  }

  if (status.kind === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-accent" aria-hidden="true" />
        <h3 className="mt-4 font-display text-2xl uppercase tracking-wide text-foreground">
          Takk for meldingen!
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-muted-foreground">
          Vi tar kontakt så snart vi kan, vanligvis innen samme arbeidsdag.
          Trenger du raskere svar, ring oss på{" "}
          <a
            href={`tel:${BUSINESS.contact.phoneE164}`}
            className="font-medium text-accent hover:text-accent-soft"
          >
            {BUSINESS.contact.phone}
          </a>
          .
        </p>
        <Button
          variant="outline"
          size="md"
          className="mt-6"
          onClick={() => setStatus({ kind: "idle" })}
        >
          Send en ny melding
        </Button>
      </div>
    );
  }

  const isLoading = status.kind === "loading";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="space-y-5 rounded-2xl border border-border bg-background p-6 md:p-8"
      aria-describedby={status.kind === "error" ? "form-error" : undefined}
    >
      {/* Honeypot — hidden from humans, bots fill it */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={ids.hp}>Nettside (ikke fyll ut)</label>
        <input
          id={ids.hp}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={ids.name}
          label="Navn"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Ditt fulle navn"
        />
        <Field
          id={ids.email}
          label="E-post"
          name="email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          required
          placeholder="din@epost.no"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={ids.phone}
          label="Telefon"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="91 23 45 67"
          optional
        />
        <SelectField
          id={ids.topic}
          label="Hva gjelder henvendelsen"
          name="topic"
          options={TOPICS}
          optional
        />
      </div>

      <div>
        <label
          htmlFor={ids.message}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Melding <span aria-hidden="true" className="text-accent">*</span>
        </label>
        <textarea
          id={ids.message}
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder="Beskriv plagget, ønsket arbeid, og gjerne et tidspunkt som passer …"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id={ids.consent}
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 rounded border-border text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        />
        <label
          htmlFor={ids.consent}
          className="text-sm leading-relaxed text-muted-foreground"
        >
          Jeg godtar at Ararat Skredderi behandler opplysningene mine for å
          svare på henvendelsen. Se{" "}
          <Link to="/personvern" className="text-accent hover:text-accent-soft">
            personvernerklæringen
          </Link>
          .
        </label>
      </div>

      {status.kind === "error" && (
        <div
          ref={errorRef}
          id="form-error"
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {status.message}
        </div>
      )}

      <div className="flex flex-col items-stretch gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Vi svarer som regel innen samme arbeidsdag.
        </p>
        <Button type="submit" variant="primary" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sender…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Send melding
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  spellCheck?: boolean;
}

function Field({
  id,
  label,
  name,
  type,
  autoComplete,
  inputMode,
  placeholder,
  required,
  optional,
  spellCheck,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-foreground"
      >
        {label}{" "}
        {required ? (
          <span aria-hidden="true" className="text-accent">
            *
          </span>
        ) : optional ? (
          <span className="text-xs font-normal text-muted-foreground">
            (valgfritt)
          </span>
        ) : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        required={required}
        spellCheck={spellCheck}
        className={cn(
          "w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        )}
      />
    </div>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  name: string;
  options: string[];
  optional?: boolean;
}

function SelectField({ id, label, name, options, optional }: SelectFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-foreground"
      >
        {label}{" "}
        {optional ? (
          <span className="text-xs font-normal text-muted-foreground">
            (valgfritt)
          </span>
        ) : null}
      </label>
      <select
        id={id}
        name={name}
        defaultValue=""
        className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230f172a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center", backgroundSize: "16px", paddingRight: "2.5rem" }}
      >
        <option value="" disabled>
          Velg en kategori …
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
