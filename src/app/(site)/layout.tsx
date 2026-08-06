import { Analytics } from "@/components/site/analytics";
import { CookieBanner } from "@/components/site/cookie-banner";
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

  const ga4Id = settings?.ga4MeasurementId?.trim() || null;
  const cookieMessage = settings?.cookieBannerMessage?.trim() || null;
  const acceptLabel = settings?.cookieAcceptLabel?.trim() || null;
  const rejectLabel = settings?.cookieRejectLabel?.trim() || null;

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      {cookieMessage && acceptLabel && rejectLabel ? (
        <CookieBanner
          message={cookieMessage}
          acceptLabel={acceptLabel}
          rejectLabel={rejectLabel}
        />
      ) : null}
      {ga4Id ? <Analytics measurementId={ga4Id} /> : null}
    </>
  );
}
