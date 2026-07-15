import type { Metadata } from "next";
import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Proxara Policy Studio",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <NextStudio config={config} />;
}
