import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { defaultOgImage, siteUrl } from "@/lib/seo";

const publicSans = localFont({
  src: "../fonts/public-sans-latin-wght-normal.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

const sourceSerif = localFont({
  src: [
    {
      // Adobe's official Source Serif 4.005 variable roman, subset to Latin.
      // Two axes (wght 200–900, opsz 8–60) plus the smcp/c2sc/onum features
      // that Fontsource's Latin subset strips — those give the site real small
      // caps and oldstyle figures instead of faked ones. 140KB.
      path: "../fonts/source-serif-4-latin-opsz-smcp-normal.woff2",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "../fonts/source-serif-4-latin-wght-italic.woff2",
      weight: "200 900",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Proxara Policy",
    template: "%s",
  },
  description:
    "Proxara Policy helps governments, technology companies, and multilateral institutions navigate the politics of emerging technology.",
  openGraph: {
    type: "website",
    siteName: "Proxara Policy",
    images: [defaultOgImage],
  },
  twitter: { card: "summary_large_image", images: [defaultOgImage] },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Proxara Policy Limited",
  url: siteUrl,
  logo: `${siteUrl}/proxara-logo.png`,
  founder: { "@type": "Person", name: "Mwenda Kilemi" },
  address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
  areaServed: ["Africa", "Europe"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${sourceSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
