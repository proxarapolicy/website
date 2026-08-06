import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { EssayIndexItem } from "@/lib/essay-index";

type EssayAdjacentNavProps = {
  newer: EssayIndexItem | null;
  older: EssayIndexItem | null;
};

export function EssayAdjacentNav({ newer, older }: EssayAdjacentNavProps) {
  if (!newer && !older) return null;

  return (
    <nav
      aria-label="Adjacent essays"
      className="grid gap-4 border-y border-border py-8 sm:grid-cols-2"
    >
      {newer?.slug ? (
        <Link
          href={`/thinking/${newer.slug}`}
          className="group flex flex-col gap-2 border border-border border-t-2 border-t-transparent bg-background p-5 transition-colors hover:border-t-gold hover:bg-surface-navy-wash"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.06em] text-gold-deep uppercase">
            <ArrowLeft
              className="size-3.5 transition-transform duration-200 ease-out group-hover:-translate-x-1"
              aria-hidden
            />
            Newer
          </span>
          <span className="font-serif text-base leading-snug text-navy md:text-lg">
            {newer.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block" aria-hidden />
      )}

      {older?.slug ? (
        <Link
          href={`/thinking/${older.slug}`}
          className="group flex flex-col gap-2 border border-border border-t-2 border-t-transparent bg-background p-5 text-right transition-colors hover:border-t-gold hover:bg-surface-navy-wash sm:items-end"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.06em] text-gold-deep uppercase">
            Older
            <ArrowRight
              className="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1"
              aria-hidden
            />
          </span>
          <span className="font-serif text-base leading-snug text-navy md:text-lg">
            {older.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
