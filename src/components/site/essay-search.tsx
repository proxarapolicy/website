"use client";

import { useDeferredValue, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format";
import type { EssayIndexItem } from "@/lib/essay-index";

type EssaySearchProps = {
  essays: EssayIndexItem[];
  currentSlug?: string | null;
};

/**
 * Filters a server-provided essay index in the browser — no client fetch.
 */
export function EssaySearch({ essays, currentSlug }: EssaySearchProps) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query.trim().toLowerCase());

  const results =
    deferred.length < 2
      ? []
      : essays.filter((essay) => {
          if (essay.slug === currentSlug) return false;
          const haystack = `${essay.title ?? ""} ${essay.excerpt ?? ""}`.toLowerCase();
          return haystack.includes(deferred);
        });

  return (
    <div>
      <label htmlFor="essay-search" className="eyebrow text-muted-foreground">
        Search essays
      </label>
      <div className="relative mt-3">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id="essay-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or topic…"
          className="h-10 rounded-none border-border bg-background pl-9 text-sm focus-visible:border-gold focus-visible:ring-gold/30"
          autoComplete="off"
        />
      </div>

      {deferred.length >= 2 ? (
        <ul className="mt-3 border border-border border-t-0 bg-background">
          {results.length === 0 ? (
            <li className="px-3 py-3 text-sm text-muted-foreground">
              No matching essays.
            </li>
          ) : (
            results.slice(0, 6).map((essay) =>
              essay.slug ? (
                <li key={essay._id} className="border-t border-border first:border-t-0">
                  <Link
                    href={`/thinking/${essay.slug}`}
                    className="block px-3 py-3 transition-colors hover:bg-surface-navy-wash"
                  >
                    <span className="font-serif text-sm leading-snug text-navy">
                      {essay.title}
                    </span>
                    {essay.publishedAt ? (
                      <span className="figures-oldstyle mt-1 block text-xs text-muted-foreground">
                        {formatDate(essay.publishedAt)}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ) : null,
            )
          )}
        </ul>
      ) : null}
    </div>
  );
}
