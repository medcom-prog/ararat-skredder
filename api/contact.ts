/**
 * Vercel serverless function — POST /api/contact
 *
 * Sends contact-form submissions to Ararat Skredderi's inbox via Resend.
 * The "from" address uses Medcom's verified domain (noreply@medcom.no)
 * and the customer's email is set as Reply-To so Ararat can respond
 * directly without forwarding.
 *
 * Required env vars (set in Vercel project settings):
 *   RESEND_API_KEY          Resend API key (re_...) — Ararat-scoped, Sending access
 *
 * Optional:
 *   CONTACT_TO_EMAIL        Recipient (default: ararat_skredder@hotmail.com)
 *   CONTACT_FROM_EMAIL      Sender (default: "Ararat Skredderi <noreply@araratskredderi.no>")
 *                           Requires the `from` domain to be verified in Resend.
 *
 * If RESEND_API_KEY is missing, the route returns 503 with a clear
 * error so the frontend can show "Ring oss direkte"-fallback.
 */

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  topic?: string;
  message?: string;
  consent?: boolean;
  honeypot?: string;
}

interface VercelRequest {
  method?: string;
  body: ContactPayload | string;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (key: string, value: string) => void;
}

const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "ararat_skredder@hotmail.com";
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ??
  "Ararat Skredderi <noreply@araratskredderi.no>";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validate(p: ContactPayload): string | null {
  if (p.honeypot) return "spam-detected"; // bots fill hidden fields
  if (!p.consent) return "Du må godta personvernerklæringen.";
  if (!p.name || p.name.trim().length < 2) return "Skriv inn navnet ditt.";
  if (!p.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))
    return "Skriv inn en gyldig e-postadresse.";
  if (!p.message || p.message.trim().length < 10)
    return "Skriv en melding (minst 10 tegn).";
  if (p.message.length > 5000) return "Meldingen er for lang (maks 5 000 tegn).";
  return null;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      ok: false,
      error:
        "Skjema-tjenesten er ikke konfigurert ennå. Ring oss på 91 92 19 08 eller send e-post.",
    });
    return;
  }

  const body: ContactPayload =
    typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});

  const validationError = validate(body);
  if (validationError === "spam-detected") {
    // Pretend success for bots — no point telling them they were caught.
    res.status(200).json({ ok: true });
    return;
  }
  if (validationError) {
    res.status(400).json({ ok: false, error: validationError });
    return;
  }

  const name = body.name!.trim();
  const email = body.email!.trim();
  const phone = body.phone?.trim() ?? "";
  const topic = body.topic?.trim() ?? "Generell henvendelse";
  const message = body.message!.trim();

  const subject = `Ny henvendelse: ${topic} — ${name}`;
  const html = `<!doctype html>
<html lang="nb">
<body style="font-family: -apple-system, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0f172a;">
  <h2 style="font-size: 18px; margin: 0 0 16px;">Ny henvendelse fra araratskredderi.no</h2>

  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; color: #475569; width: 120px;">Navn:</td><td style="padding: 8px 0;">${escapeHtml(name)}</td></tr>
    <tr><td style="padding: 8px 0; color: #475569;">E-post:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #0b5fff;">${escapeHtml(email)}</a></td></tr>
    ${phone ? `<tr><td style="padding: 8px 0; color: #475569;">Telefon:</td><td style="padding: 8px 0;"><a href="tel:${escapeHtml(phone)}" style="color: #0b5fff;">${escapeHtml(phone)}</a></td></tr>` : ""}
    <tr><td style="padding: 8px 0; color: #475569;">Hva gjelder:</td><td style="padding: 8px 0;">${escapeHtml(topic)}</td></tr>
  </table>

  <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px;">
    <p style="font-size: 13px; color: #475569; margin: 0 0 8px;">MELDING</p>
    <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
  </div>

  <p style="margin-top: 24px; font-size: 12px; color: #94a3b8;">
    Send fra kontaktskjema på <a href="https://www.araratskredderi.no/kontakt" style="color: #0b5fff;">araratskredderi.no/kontakt</a>.
    Svar direkte på denne e-posten for å nå avsenderen.
  </p>
</body>
</html>`;

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject,
        html,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      // eslint-disable-next-line no-console
      console.error("[contact] Resend error:", resp.status, errText);
      res.status(502).json({
        ok: false,
        error: "Kunne ikke sende meldingen akkurat nå. Prøv igjen om litt eller ring oss direkte.",
      });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[contact] fetch failed:", err);
    res.status(500).json({
      ok: false,
      error: "Noe gikk galt på vår side. Prøv igjen eller ring 91 92 19 08.",
    });
  }
}
