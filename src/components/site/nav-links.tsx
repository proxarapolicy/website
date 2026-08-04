"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string };

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop nav — gold underline + navy type mark the current page. */
export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative py-1 text-sm transition-colors",
              active
                ? "font-medium text-navy after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-gold"
                : "text-muted-foreground hover:text-navy",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

/** Mobile sheet links — gold leading rule marks the current page. */
export function MobileNavLinks({
  items,
  onNavigate,
}: {
  items: NavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "border-b border-border/60 py-2.5 text-base transition-colors",
              active
                ? "border-l-2 border-l-gold pl-3 font-medium text-navy"
                : "pl-0 text-foreground hover:text-navy",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
