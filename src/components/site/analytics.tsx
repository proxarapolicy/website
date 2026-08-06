"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import {
  CONSENT_EVENT,
  getConsent,
  type ConsentValue,
} from "@/lib/consent";

export function Analytics({ measurementId }: { measurementId: string }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    function sync(value: ConsentValue | null) {
      setAllowed(value === "accepted");
    }

    sync(getConsent());

    function onConsent(event: Event) {
      const detail = (event as CustomEvent<ConsentValue>).detail;
      sync(detail);
    }

    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);

  if (!allowed || !measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
