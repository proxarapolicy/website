import Link from "next/link";

import { Mark } from "@/components/site/mark";
import { Button } from "@/components/ui/button";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity/types";

export function SiteFooter({
  settings,
}: {
  settings: SITE_SETTINGS_QUERY_RESULT;
}) {
  const year = new Date().getFullYear();
  const wordmark = settings?.wordmark ?? "Proxara Policy";
  const navItems = (settings?.navItems ?? []).filter(
    (item): item is { label: string; href: string } =>
      Boolean(item.href && item.label),
  );

  return (
    <footer className="mt-auto bg-navy-deep text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {settings?.footerCta ? (
          <div className="border-b border-on-navy-line py-14 md:py-16">
            <div className="mb-6 flex items-center gap-2.5">
              <Mark className="size-2.5 text-primary-foreground" />
              <span className="h-px w-12 bg-gold" aria-hidden />
            </div>
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end md:gap-12">
              <p className="max-w-2xl font-serif text-2xl leading-snug tracking-display md:text-3xl">
                {settings.footerCta}
              </p>
              <Button
                size="lg"
                className="shrink-0 bg-gold-cta text-navy-deep hover:bg-gold-cta/90"
                nativeButton={false}
                render={<Link href="/contact" />}
              >
                {settings.ctaLabel ?? "Get in touch"}
              </Button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-10 py-14 md:grid-cols-12 md:gap-8 md:py-16">
          <div className="md:col-span-5 lg:col-span-5">
            {/*
              Do not use /proxara-logo.png here — the asset has an opaque white
              plate, so it reads as a blank white bar on navy-deep.
            */}
            <Link
              href="/"
              className="group inline-flex items-center gap-3 text-primary-foreground"
              aria-label={`${wordmark} — home`}
            >
              <Mark className="size-6 shrink-0 text-primary-foreground" />
              <span className="font-serif text-xl leading-none tracking-display text-primary-foreground md:text-2xl">
                {wordmark}
              </span>
            </Link>
            {settings?.location ? (
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-on-navy-muted">
                {settings.location}
              </p>
            ) : null}
          </div>

          <nav
            aria-label="Footer"
            className="md:col-span-3 lg:col-span-3"
          >
            <p className="eyebrow text-gold-on-navy">Navigate</p>
            <ul className="mt-4 space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-on-navy-muted transition-colors hover:text-primary-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4 lg:col-span-4 md:text-right">
            <p className="eyebrow text-gold-on-navy">Contact</p>
            <div className="mt-4 space-y-3 text-sm">
              {settings?.contactEmail ? (
                <p>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="text-on-navy-muted transition-colors hover:text-primary-foreground"
                  >
                    {settings.contactEmail}
                  </a>
                </p>
              ) : null}
              {settings?.linkedinUrl ? (
                <p>
                  <a
                    href={settings.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-on-navy-muted transition-colors hover:text-primary-foreground"
                  >
                    LinkedIn
                  </a>
                </p>
              ) : null}
              <p className="pt-1">
                <Link
                  href="/contact"
                  className="font-medium text-gold-on-navy underline decoration-gold/50 underline-offset-[0.18em] transition-colors hover:decoration-gold"
                >
                  {settings?.ctaLabel ?? "Get in touch"}
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-on-navy-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-on-navy-faint">
            © {year} {settings?.footerLegal ?? "Proxara Policy Limited."}
          </p>
          <p className="inline-flex items-center gap-2 text-xs text-on-navy-faint">
            <Mark className="size-2 text-on-navy-faint" />
            <span>{wordmark}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
