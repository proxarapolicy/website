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
import { MobileNavLinks } from "./nav-links";

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
        <nav className="flex flex-col gap-1 px-4" aria-label="Primary">
          <MobileNavLinks items={items} onNavigate={() => setOpen(false)} />
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
