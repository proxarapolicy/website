"use client";

import * as React from "react";
import { toast, Toaster } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function ContactForm({
  successMessage,
  enquiryTypeLabel,
  enquiryTypes,
  messageLabel,
  submitLabel,
}: {
  successMessage?: string | null;
  enquiryTypeLabel?: string | null;
  enquiryTypes?: string[] | null;
  messageLabel?: string | null;
  submitLabel?: string | null;
}) {
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent">(
    "idle"
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    try {
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
        err instanceof Error ? err.message : "Something went wrong. Please email us directly."
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-border bg-muted px-6 py-10 text-center">
        <p className="font-serif text-xl text-navy">
          {successMessage ??
            "Thank you. Your enquiry has been received — we’ll be in touch shortly."}
        </p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-center" richColors />
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot — humans never see or fill this */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required autoComplete="name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organisation">Organisation</Label>
            <Input id="organisation" name="organisation" required autoComplete="organization" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>

        {enquiryTypes?.length ? (
          <div className="space-y-2">
            <Label htmlFor="enquiryType">
              {enquiryTypeLabel ?? "What can we help with?"}
            </Label>
            {/* Native select: no extra dependency, no extra client JS. */}
            <select
              id="enquiryType"
              name="enquiryType"
              required
              defaultValue=""
              className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
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
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="message">{messageLabel ?? "Message"}</Label>
          <Textarea id="message" name="message" required rows={5} />
        </div>

        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : submitLabel ?? "Send"}
        </Button>
      </form>
    </>
  );
}
