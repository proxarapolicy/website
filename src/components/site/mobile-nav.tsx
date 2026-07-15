"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = { label: string; href: string };

export function MobileNav({
  wordmark,
  items,
  ctaLabel,
}: {
  wordmark: string;
  items: NavItem[];
  ctaLabel?: string | null;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="font-serif text-left text-lg text-navy">
            {wordmark}
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-2.5 text-base text-foreground hover:text-navy border-b border-border/60"
            >
              {item.label}
            </Link>
          ))}
          {ctaLabel ? (
            <Button
              className="mt-6"
              nativeButton={false}
              render={<Link href="/contact" onClick={() => setOpen(false)} />}
            >
              {ctaLabel}
            </Button>
          ) : null}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
