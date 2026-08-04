import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found — Proxara Policy",
  robots: { index: false, follow: false },
};

/**
 * Site-route 404. Header/footer come from `(site)/layout` — do not re-render
 * them here or they double up when `notFound()` is called from a page.
 */
export default function SiteNotFound() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
      <p className="eyebrow text-gold-deep">404</p>
      <h1 className="mt-4 max-w-2xl font-serif text-h1 leading-[1.12] tracking-display text-navy">
        This page doesn’t exist.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
        The page you’re looking for may have moved or never existed. The links
        below will get you back on track.
      </p>
      <nav className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
        <Link
          href="/"
          className="font-serif text-lg text-navy underline decoration-gold underline-offset-4 hover:decoration-2"
        >
          Home
        </Link>
        <Link
          href="/thinking"
          className="font-serif text-lg text-navy underline decoration-gold underline-offset-4 hover:decoration-2"
        >
          Thinking
        </Link>
        <Link
          href="/what-we-do"
          className="font-serif text-lg text-navy underline decoration-gold underline-offset-4 hover:decoration-2"
        >
          What We Do
        </Link>
        <Link
          href="/contact"
          className="font-serif text-lg text-navy underline decoration-gold underline-offset-4 hover:decoration-2"
        >
          Contact
        </Link>
      </nav>
    </div>
  );
}
