"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

import { getConsent, subscribeConsent } from "@/lib/consent";

export function Analytics({ measurementId }: { measurementId: string }) {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsent,
    () => null,
  );
  const allowed = consent === "accepted";

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
