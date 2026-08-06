import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Sanity webhook target. Configure in sanity.io/manage → API → Webhooks:
 *   URL:    https://proxarapolicy.com/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 *   Events: create, update, delete
 * Content edits then go live within seconds without a rebuild.
 *
 * Tags alone (SWR "max") can leave a sticky Full Route Cache on Vercel.
 * Also expire tags immediately and bust the shared site layout so banner
 * copy / settings changes show on the next request.
 */
const SITE_PATHS = [
  "/",
  "/what-we-do",
  "/who-we-work-with",
  "/about",
  "/thinking",
  "/contact",
] as const;

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

  // Expire immediately (not SWR "max") so the next visit blocks on fresh data.
  if (type) revalidateTag(type, { expire: 0 });
  revalidateTag("sanity", { expire: 0 });

  // Invalidate the (site) layout tree and each public path.
  revalidatePath("/", "layout");
  for (const path of SITE_PATHS) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, type: type ?? "all" });
}
