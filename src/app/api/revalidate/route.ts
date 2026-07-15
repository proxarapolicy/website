import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Sanity webhook target. Configure in sanity.io/manage → API → Webhooks:
 *   URL:    https://proxarapolicy.com/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 *   Events: create, update, delete
 * Content edits then go live within seconds without a rebuild.
 */
export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  if (
    !process.env.SANITY_REVALIDATE_SECRET ||
    secret !== process.env.SANITY_REVALIDATE_SECRET
  ) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }

  let type: string | undefined;
  try {
    const body = await request.json();
    type = body?._type;
  } catch {
    // fall through — revalidate everything
  }

  // Bust the specific document-type tag when known, and the catch-all tag always.
  if (type) revalidateTag(type, "max");
  revalidateTag("sanity", "max");

  return NextResponse.json({ revalidated: true, type: type ?? "all" });
}
