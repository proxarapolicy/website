import { Fragment } from "react";
import Link from "next/link";
import {
  PortableText as PortableTextRenderer,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

import { Mark } from "@/components/site/mark";
import { cn } from "@/lib/utils";

/**
 * Fixed site routes from the client URL contract. Phrases are matched in
 * running copy so "What We Do" / "Who We Work With" become real internal links
 * even when Sanity content was authored without a link mark.
 */
const INTERNAL_PAGE_LINKS: ReadonlyArray<{ phrase: string; href: string }> = [
  { phrase: "Who We Work With", href: "/who-we-work-with" },
  { phrase: "What We Do", href: "/what-we-do" },
];

const INTERNAL_PAGE_PATTERN = new RegExp(
  INTERNAL_PAGE_LINKS.map(({ phrase }) =>
    phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  ).join("|"),
  "g",
);

const HREF_BY_PHRASE = new Map(
  INTERNAL_PAGE_LINKS.map(({ phrase, href }) => [phrase, href]),
);

/** Turn known page titles into internal links in running copy. */
function enrichPlainText(text: string): React.ReactNode {
  const matches = [...text.matchAll(INTERNAL_PAGE_PATTERN)];
  if (matches.length === 0) return text;

  const out: React.ReactNode[] = [];
  let last = 0;

  for (const match of matches) {
    const phrase = match[0];
    const start = match.index ?? 0;
    const href = HREF_BY_PHRASE.get(phrase);
    if (start > last) {
      out.push(text.slice(last, start));
    }
    if (href) {
      out.push(
        <Link
          key={`internal-${start}-${phrase}`}
          href={href}
          className="font-medium text-gold-deep underline decoration-gold underline-offset-[0.18em] transition-colors hover:text-navy hover:decoration-gold-deep"
        >
          {phrase}
        </Link>,
      );
    } else {
      out.push(phrase);
    }
    last = start + phrase.length;
  }
  if (last < text.length) out.push(text.slice(last));

  return out.map((node, i) => <Fragment key={i}>{node}</Fragment>);
}

/** Applies internal-link treatment to plain strings among children. */
function typeset(children: React.ReactNode): React.ReactNode {
  if (typeof children === "string") return enrichPlainText(children);
  if (Array.isArray(children)) {
    return children.map((child, i) =>
      typeof child === "string" ? (
        <Fragment key={i}>{enrichPlainText(child)}</Fragment>
      ) : (
        child
      ),
    );
  }
  return children;
}

/**
 * Plain-string body (e.g. About civicBody) with the same internal-link
 * treatment as Portable Text.
 */
export function LinkedProse({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return <p className={className}>{enrichPlainText(children)}</p>;
}

const linkClassName =
  "font-medium text-gold-deep underline decoration-gold underline-offset-[0.18em] transition-colors hover:text-navy hover:decoration-gold-deep";

function LinkMark({
  children,
  value,
}: PortableTextMarkComponentProps<{ _type: "link"; href?: string }>) {
  const href: string = value?.href ?? "#";
  const external = /^https?:\/\//.test(href) || href.startsWith("mailto:");
  return external ? (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      className={linkClassName}
    >
      {children}
    </a>
  ) : (
    <Link href={href} className={linkClassName}>
      {children}
    </Link>
  );
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="prose-p mb-7 text-[1.0625rem] leading-[1.75] text-foreground/90">
        {typeset(children)}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-5 mt-14 font-serif text-2xl leading-snug tracking-display text-navy md:text-3xl">
        <span className="mb-4 flex items-center gap-2.5">
          <Mark className="size-2.5 text-navy" />
          <span className="h-px flex-1 max-w-[3rem] bg-gold" aria-hidden />
        </span>
        {typeset(children)}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-10 border-l-2 border-gold pl-4 font-serif text-xl text-navy">
        {typeset(children)}
      </h3>
    ),
    // Hanging punctuation lets the opening quote sit out in the margin so the
    // first line of the quote stays optically flush with the text above it.
    blockquote: ({ children }) => (
      <blockquote className="my-10 border-l-2 border-gold bg-surface-gold-wash px-6 py-5 font-serif text-xl leading-snug text-navy [hanging-punctuation:first_last] md:px-8">
        {typeset(children)}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-7 list-disc space-y-2.5 pl-6 text-[1.0625rem] leading-[1.75] text-foreground/90 marker:text-gold">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-7 list-decimal space-y-2.5 pl-6 text-[1.0625rem] leading-[1.75] text-foreground/90 marker:text-muted-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{typeset(children)}</li>,
    number: ({ children }) => <li>{typeset(children)}</li>,
  },
  marks: {
    link: LinkMark,
    strong: ({ children }) => (
      <strong className="font-semibold text-navy">{typeset(children)}</strong>
    ),
    em: ({ children }) => <em className="italic">{typeset(children)}</em>,
  },
};

export function PortableText({
  value,
  className,
}: {
  value: PortableTextBlock[];
  className?: string;
}) {
  return (
    <div className={cn("prose-editorial prose-measure", className)}>
      <PortableTextRenderer value={value} components={components} />
    </div>
  );
}
