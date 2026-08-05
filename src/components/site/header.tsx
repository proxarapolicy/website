import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { filterNavItems } from "@/lib/feature-flags";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity/types";

export function SiteHeader({
  settings,
}: {
  settings: SITE_SETTINGS_QUERY_RESULT;
}) {
  const wordmark = settings?.wordmark ?? "Proxara Policy";
  const navItems = filterNavItems(
    (settings?.navItems ?? []).flatMap((i) =>
      i.href && i.label ? [{ label: i.label, href: i.href }] : [],
    ),
  );
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

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          <NavLinks items={navItems} />
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
          items={navItems}
          ctaLabel={ctaLabel}
        />
      </div>
    </header>
  );
}
