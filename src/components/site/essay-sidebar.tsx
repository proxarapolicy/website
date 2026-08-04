import Link from "next/link";

import { EssaySearch } from "@/components/site/essay-search";
import { Mark } from "@/components/site/mark";
import { formatDate } from "@/lib/format";
import type { EssayIndexItem } from "@/lib/essay-index";

type EssaySidebarProps = {
  essays: EssayIndexItem[];
  currentSlug?: string | null;
};

export function EssaySidebar({ essays, currentSlug }: EssaySidebarProps) {
  const recent = essays
    .filter((essay) => essay.slug !== currentSlug)
    .slice(0, 5);

  return (
    <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
      <div className="border border-border border-t-2 border-t-gold bg-surface-navy-wash p-5 md:p-6">
        <EssaySearch essays={essays} currentSlug={currentSlug} />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <Mark className="size-2.5 text-navy" />
          <h2 className="eyebrow text-navy">Recent essays</h2>
        </div>
        <span className="mt-3 block h-0.5 w-10 bg-gold" aria-hidden />

        {recent.length === 0 ? (
          <p className="mt-5 text-sm text-muted-foreground">
            More essays will appear here as they are published.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-border border-y border-border">
            {recent.map((essay) =>
              essay.slug ? (
                <li key={essay._id}>
                  <Link
                    href={`/thinking/${essay.slug}`}
                    className="group block py-4 transition-colors hover:bg-surface-navy-wash"
                  >
                    <p className="figures-oldstyle text-xs text-muted-foreground">
                      {formatDate(essay.publishedAt)}
                    </p>
                    <p className="mt-1.5 font-serif text-[0.9375rem] leading-snug text-navy group-hover:underline group-hover:decoration-gold group-hover:underline-offset-4">
                      {essay.title}
                    </p>
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        )}

        <p className="mt-5">
          <Link
            href="/thinking"
            className="text-sm font-medium text-gold-deep underline decoration-gold underline-offset-[0.18em] transition-colors hover:text-navy hover:decoration-gold-deep"
          >
            All thinking
          </Link>
        </p>
      </div>
    </aside>
  );
}
