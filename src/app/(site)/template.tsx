import { ViewTransition } from "react";

/**
 * Remounts on every (site) navigation so enter/exit can fire. A short opacity
 * crossfade only — no slides, no choreography. Header and footer sit outside
 * this tree and are isolated via view-transition-name so they stay put.
 */
export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransition enter="page-fade" exit="page-fade">
      {children}
    </ViewTransition>
  );
}
