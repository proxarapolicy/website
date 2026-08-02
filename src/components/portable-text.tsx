import { Fragment } from "react";
import Link from "next/link";
import {
  PortableText as PortableTextRenderer,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

/**
 * Runs of two or more capitals — AI, OECD, GDPR, ICT — set as small caps.
 *
 * A policy essay is dense with acronyms, and at full cap height they punch
 * bright holes through the text block. Dropping them to small caps is the
 * standard fix in book and journal typesetting. Digits are allowed inside a run
 * (COVID-19) but a run must start with two letters so ordinary capitalised
 * words and single initials are left alone.
 */
const ACRONYM = /\b[A-Z]{2,}(?:[-–][A-Z0-9]+)*\b/g;

function smallCapAcronyms(text: string) {
  if (!/[A-Z]{2,}/.test(text)) return text;

  const out: React.ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(ACRONYM)) {
    const start = match.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    out.push(
      <span key={start} className="caps">
        {match[0]}
      </span>,
    );
    last = start + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));

  return out.map((node, i) => <Fragment key={i}>{node}</Fragment>);
}

/** Applies the acronym treatment to any plain strings among children. */
function typeset(children: React.ReactNode): React.ReactNode {
  if (typeof children === "string") return smallCapAcronyms(children);
  if (Array.isArray(children)) {
    return children.map((child, i) =>
      typeof child === "string" ? (
        <Fragment key={i}>{smallCapAcronyms(child)}</Fragment>
      ) : (
        child
      ),
    );
  }
  return children;
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 leading-[1.7] text-foreground/90">
        {typeset(children)}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-12 font-serif text-2xl text-navy">
        {typeset(children)}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-10 font-serif text-xl text-navy">
        {typeset(children)}
      </h3>
    ),
    // Hanging punctuation lets the opening quote sit out in the margin so the
    // first line of the quote stays optically flush with the text above it.
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-gold pl-6 font-serif text-xl leading-snug text-navy [hanging-punctuation:first_last]">
        {typeset(children)}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 list-disc space-y-2 pl-6 leading-[1.7] text-foreground/90 marker:text-gold">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 list-decimal space-y-2 pl-6 leading-[1.7] text-foreground/90 marker:text-muted-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{typeset(children)}</li>,
    number: ({ children }) => <li>{typeset(children)}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = href.startsWith("http");
      // decoration-gold measures 4.0:1 on white — comfortably past the 3:1 that
      // WCAG 1.4.11 asks of non-text indicators, and it keeps the accent
      // legible as gold rather than drifting olive the way gold-deep does.
      const className =
        "underline decoration-gold transition-colors hover:text-navy hover:decoration-gold-deep";
      return external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {children}
        </a>
      ) : (
        <Link href={href} className={className}>
          {children}
        </Link>
      );
    },
  },
};

export function PortableText({ value }: { value: PortableTextBlock[] }) {
  return <PortableTextRenderer value={value} components={components} />;
}
