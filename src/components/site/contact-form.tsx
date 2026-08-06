"use client";

import * as React from "react";
import Script from "next/script";
import { ArrowRight } from "lucide-react";
import { toast, Toaster } from "sonner";

import { Mark } from "@/components/site/mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}

/** Shared control chrome — 44px touch height, institutional radius, gold focus. */
const fieldControlClassName = cn(
  "h-11 rounded-[var(--radius)] border-border bg-background px-3.5 text-base",
  "placeholder:text-muted-foreground/80",
  "focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/35",
  "md:text-sm",
);

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() || null;

function Field({
  id,
  label,
  children,
  className,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-navy">
        {label}
      </Label>
      {children}
    </div>
  );
}

async function getRecaptchaToken(): Promise<string | undefined> {
  if (!siteKey) return undefined;
  const grecaptcha = window.grecaptcha;
  if (!grecaptcha) {
    throw new Error(
      "Security check is still loading. Please wait a moment and try again.",
    );
  }
  return new Promise((resolve, reject) => {
    grecaptcha.ready(() => {
      grecaptcha
        // Must match RECAPTCHA_ACTION in src/lib/recaptcha.ts
        .execute(siteKey, { action: "contact" })
        .then(resolve)
        .catch(() =>
          reject(
            new Error(
              "Could not complete the security check. Please try again.",
            ),
          ),
        );
    });
  });
}

export function ContactForm({
  successMessage,
  enquiryTypeLabel,
  enquiryTypes,
  messageLabel,
  submitLabel,
  responseNote,
}: {
  successMessage?: string | null;
  enquiryTypeLabel?: string | null;
  enquiryTypes?: string[] | null;
  messageLabel?: string | null;
  submitLabel?: string | null;
  responseNote?: string | null;
}) {
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent">(
    "idle",
  );

  // Stamped after hydration, so a script that posts the raw HTML form never
  // has one. The server rejects submissions with no stamp, or an implausibly
  // fast one — see the time trap in /api/contact.
  const startedAt = React.useRef<number | null>(null);
  React.useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    setStatus("sending");
    try {
      const recaptchaToken = await getRecaptchaToken();
      const data = {
        ...Object.fromEntries(new FormData(form).entries()),
        startedAt: startedAt.current,
        ...(recaptchaToken ? { recaptchaToken } : {}),
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong.");
      }
      setStatus("sent");
      window.gtag?.("event", "generate_lead", {
        event_category: "contact",
        event_label: "enquiry_form",
      });
    } catch (err) {
      setStatus("idle");
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please email us directly.",
      );
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="border border-border border-t-2 border-t-gold bg-surface-navy-wash px-6 py-12 text-center md:px-10"
      >
        <Mark className="mx-auto mb-5 size-3 text-navy" />
        <p className="font-serif text-xl leading-snug text-navy md:text-2xl">
          {successMessage ??
            "Thank you. Your enquiry has been received — we’ll be in touch shortly."}
        </p>
      </div>
    );
  }

  return (
    <>
      {siteKey ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
          strategy="afterInteractive"
        />
      ) : null}
      <Toaster position="bottom-center" richColors />
      <form
        onSubmit={handleSubmit}
        className="space-y-7"
        aria-busy={status === "sending"}
        noValidate={false}
      >
        {/* Honeypot — humans never see or fill this */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="name" label="Name">
            <Input
              id="name"
              name="name"
              required
              autoComplete="name"
              className={fieldControlClassName}
            />
          </Field>
          <Field id="organisation" label="Organisation">
            <Input
              id="organisation"
              name="organisation"
              required
              autoComplete="organization"
              className={fieldControlClassName}
            />
          </Field>
        </div>

        <Field id="email" label="Email">
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            className={fieldControlClassName}
          />
        </Field>

        {enquiryTypes?.length ? (
          <Field
            id="enquiryType"
            label={enquiryTypeLabel ?? "What can we help with?"}
          >
            {/* Native select: no extra dependency, no extra client JS. */}
            <select
              id="enquiryType"
              name="enquiryType"
              required
              defaultValue=""
              className={cn(
                fieldControlClassName,
                "w-full min-w-0 appearance-none bg-size-[1rem] bg-position-[right_0.75rem_center] bg-no-repeat pr-10 outline-none",
                "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%231B2A4A%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22m6 9 6 6 6-6%22/%3E%3C/svg%3E')]",
              )}
            >
              <option value="" disabled>
                Select one…
              </option>
              {enquiryTypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        ) : null}

        <Field id="message" label={messageLabel ?? "Message"}>
          <Textarea
            id="message"
            name="message"
            required
            rows={6}
            className={cn(
              fieldControlClassName,
              "h-auto min-h-36 resize-y py-3",
            )}
          />
        </Field>

        <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="submit"
            size="lg"
            disabled={status === "sending"}
            className="h-11 min-w-40 cursor-pointer bg-gold-cta px-6 text-navy-deep hover:bg-gold-cta/90"
          >
            {status === "sending" ? "Sending…" : (submitLabel ?? "Send")}
            {status === "idle" ? <ArrowRight className="size-4" /> : null}
          </Button>
          {responseNote ? (
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground sm:text-right">
              {responseNote}
            </p>
          ) : null}
        </div>

        {siteKey ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            This form is protected by reCAPTCHA and the Google{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-border underline-offset-2 hover:text-navy"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-border underline-offset-2 hover:text-navy"
            >
              Terms of Service
            </a>{" "}
            apply.
          </p>
        ) : null}
      </form>
    </>
  );
}
