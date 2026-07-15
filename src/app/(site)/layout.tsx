import Script from "next/script";

import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { sanityFetch } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity/types";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await sanityFetch<SITE_SETTINGS_QUERY_RESULT>({
    query: SITE_SETTINGS_QUERY,
    tags: ["sanity", "siteSettings"],
  });

  const ga4Id = settings?.ga4MeasurementId;

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      {ga4Id ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}');
            `}
          </Script>
        </>
      ) : null}
    </>
  );
}
