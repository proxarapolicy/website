/** reCAPTCHA v3 — invisible score. Both env vars must be set in production.
 *  Import only from server code (`/api/contact`). */

export const RECAPTCHA_ACTION = "contact" as const;

/** Below this, treat the submission as automated. Google's suggested default. */
const SCORE_THRESHOLD = 0.5;

type SiteverifyResponse = {
  success?: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
};

/**
 * Verifies a v3 token with Google. Returns `"skipped"` when no secret is
 * configured (local/dev), so the form still works before keys are added —
 * same pattern as Resend.
 */
export async function verifyRecaptchaToken(
  token: string | undefined,
  ip: string,
): Promise<"ok" | "skipped" | "missing" | "failed"> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return "skipped";
  if (!token?.trim()) return "missing";

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: ip,
      }),
    });

    if (!res.ok) {
      console.error("[contact] reCAPTCHA siteverify HTTP", res.status);
      return "failed";
    }

    const data = (await res.json()) as SiteverifyResponse;
    if (
      !data.success ||
      data.action !== RECAPTCHA_ACTION ||
      (data.score ?? 0) < SCORE_THRESHOLD
    ) {
      console.warn("[contact] reCAPTCHA rejected", {
        success: data.success,
        score: data.score,
        action: data.action,
        errors: data["error-codes"],
      });
      return "failed";
    }

    return "ok";
  } catch (err) {
    console.error("[contact] reCAPTCHA verify error", err);
    return "failed";
  }
}
