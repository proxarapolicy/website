import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity/types";

export function SiteFooter({
  settings,
}: {
  settings: SITE_SETTINGS_QUERY_RESULT;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-navy-deep text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        {settings?.footerCta ? (
          <div className="mb-14 flex flex-col items-start justify-between gap-6 border-b border-primary-foreground/15 pb-14 md:flex-row md:items-center">
            <p className="max-w-xl font-serif text-2xl leading-snug md:text-3xl">
              {settings.footerCta}
            </p>
            <Button
              size="lg"
              className="bg-gold text-navy-deep hover:bg-gold/90"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              {settings.ctaLabel ?? "Let’s Talk"}
            </Button>
          </div>
        ) : null}

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-lg">{settings?.wordmark ?? "Proxara Policy"}</p>
            {settings?.location ? (
              <p className="mt-2 text-sm text-primary-foreground/70">
                {settings.location}
              </p>
            ) : null}
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {(settings?.navItems ?? []).map((item) =>
              item.href ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  {item.label}
                </Link>
              ) : null
            )}
          </nav>

          <div className="flex flex-col gap-1 text-sm text-primary-foreground/70 md:text-right">
            {settings?.contactEmail ? (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="transition-colors hover:text-primary-foreground"
              >
                {settings.contactEmail}
              </a>
            ) : null}
            {settings?.linkedinUrl ? (
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary-foreground"
              >
                LinkedIn
              </a>
            ) : null}
          </div>
        </div>

        <p className="mt-12 text-xs text-primary-foreground/50">
          © {year} {settings?.footerLegal ?? "Proxara Policy Limited."}
        </p>
      </div>
    </footer>
  );
}
