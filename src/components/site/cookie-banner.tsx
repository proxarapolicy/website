"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getConsent, setConsent, type ConsentValue } from "@/lib/consent";

type CookieBannerProps = {
  message: string;
  acceptLabel: string;
  rejectLabel: string;
};

export function CookieBanner({
  message,
  acceptLabel,
  rejectLabel,
}: CookieBannerProps) {
  // null = unknown (hide to avoid flash); "show" = no stored choice
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = getConsent();
    if (existing === null) setVisible(true);
  }, []);

  function choose(value: ConsentValue) {
    setConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={message}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gold bg-white text-navy"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:gap-8 md:px-8 md:py-5">
        <p className="max-w-2xl text-sm leading-relaxed text-navy/90 md:text-[0.9375rem]">
          {message}
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="border-navy/20 text-navy hover:bg-navy/5"
            onClick={() => choose("rejected")}
          >
            {rejectLabel}
          </Button>
          <Button
            type="button"
            size="lg"
            className="bg-navy text-white hover:bg-navy-deep"
            onClick={() => choose("accepted")}
          >
            {acceptLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
