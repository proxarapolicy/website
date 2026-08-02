import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity/types";

export function SiteHeader({
  settings,
}: {
  settings: SITE_SETTINGS_QUERY_RESULT;
}) {
  const wordmark = settings?.wordmark ?? "Proxara Policy";
  const navItems = settings?.navItems ?? [];
  const ctaLabel = settings?.ctaLabel;

  return (
    // Solid background with a hard navy rule. The blurred translucent header is
    // the most-copied treatment of the last three years; a firm rule reads as
    // institutional furniture and costs no compositing work on scroll.
    <header className="sticky top-0 z-40 border-b border-navy bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label={`${wordmark} — home`}>
          <Image
            src="/proxara-logo.png"
            alt={`${wordmark} logo`}
            width={436}
            height={120}
            priority
            className="h-7 w-auto md:h-8"
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) =>
            item.href ? (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-navy"
              >
                {item.label}
              </Link>
            ) : null,
          )}
          {ctaLabel ? (
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              {ctaLabel}
            </Button>
          ) : null}
        </nav>

        <MobileNav
          wordmark={wordmark}
          items={navItems.flatMap((i) =>
            i.href && i.label ? [{ label: i.label, href: i.href }] : [],
          )}
          ctaLabel={ctaLabel}
        />
      </div>
    </header>
  );
}
