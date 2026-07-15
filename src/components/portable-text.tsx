import Link from "next/link";
import {
  PortableText as PortableTextRenderer,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 leading-relaxed text-foreground/90">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-12 font-serif text-2xl text-navy">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-10 font-serif text-xl text-navy">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-gold pl-6 font-serif text-xl leading-snug text-navy">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 list-disc space-y-2 pl-6 leading-relaxed text-foreground/90">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 list-decimal space-y-2 pl-6 leading-relaxed text-foreground/90">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = href.startsWith("http");
      return external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-gold underline-offset-4 hover:text-navy"
        >
          {children}
        </a>
      ) : (
        <Link
          href={href}
          className="underline decoration-gold underline-offset-4 hover:text-navy"
        >
          {children}
        </Link>
      );
    },
  },
};

export function PortableText({ value }: { value: PortableTextBlock[] }) {
  return <PortableTextRenderer value={value} components={components} />;
}
