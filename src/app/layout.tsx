import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { siteUrl } from "@/lib/seo";

const publicSans = localFont({
  src: "../fonts/public-sans-latin-wght-normal.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

const sourceSerif = localFont({
  src: [
    {
      path: "../fonts/source-serif-4-latin-wght-normal.woff2",
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
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Proxara Policy Limited",
  url: siteUrl,
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
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
