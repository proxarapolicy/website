/** Set to `true` to restore /thinking routes, nav links, and home-page feed. */
export const THINKING_ENABLED = false;

export function isThinkingHref(href: string) {
  return href === "/thinking" || href.startsWith("/thinking/");
}

/** Hide /thinking from header and footer nav while THINKING_ENABLED is false. */
export function filterNavItems<T extends { href: string }>(items: T[]): T[] {
  if (THINKING_ENABLED) return items;
  return items.filter((item) => !isThinkingHref(item.href));
}
