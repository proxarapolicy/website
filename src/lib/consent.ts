export type ConsentValue = "accepted" | "rejected";

export const CONSENT_COOKIE = "proxara_consent";
export const CONSENT_EVENT = "proxara:consent";
export const CONSENT_MAX_AGE = 31536000;

export function parseConsentCookie(
  cookieHeader: string | undefined | null,
): ConsentValue | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((p) => p.trim());
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const name = part.slice(0, eq).trim();
    if (name !== CONSENT_COOKIE) continue;
    const value = part.slice(eq + 1).trim();
    if (value === "accepted" || value === "rejected") return value;
    return null;
  }
  return null;
}

export function getConsent(): ConsentValue | null {
  if (typeof document === "undefined") return null;
  return parseConsentCookie(document.cookie);
}

export function subscribeConsent(onStoreChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onStoreChange);
  return () => window.removeEventListener(CONSENT_EVENT, onStoreChange);
}

export function setConsent(value: ConsentValue): void {
  if (typeof document === "undefined") return;
  const secure = window.isSecureContext ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(
    new CustomEvent(CONSENT_EVENT, { detail: value satisfies ConsentValue }),
  );
}
