import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Sanity webhook target. Configure in sanity.io/manage → API → Webhooks:
 *   URL:    https://proxarapolicy.com/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 *   Events: create, update, delete
 * Content edits then go live on the next request without a rebuild.
 *
 * Expire tags immediately (not SWR "max") and bust the (site) layout plus
 * each public path — including nested `/thinking/[slug]` via layout scope.
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

  if (type) revalidateTag(type, { expire: 0 });
  revalidateTag("sanity", { expire: 0 });

  revalidatePath("/", "layout");
  for (const path of SITE_PATHS) {
    revalidatePath(path, "page");
    revalidatePath(path, "layout");
  }

  return NextResponse.json({ revalidated: true, type: type ?? "all" });
}
