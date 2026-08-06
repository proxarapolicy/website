"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import { MOTION, cancelMotionFailsafe, motionEnabled } from "@/lib/motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

// Cancel the layout's failsafe here, at module scope, rather than in an effect.
// Reaching this line *is* the proof the GSAP chunk arrived, and it happens well
// before hydration runs effects. Waiting for a mount would let the failsafe win
// the race on a slow phone and silently disable motion for the whole page.
if (typeof window !== "undefined") cancelMotionFailsafe();

/**
 * The two motion wrappers used across the site.
 *
 * Both are client components that render their children *untouched* — the
 * children arrive as an already-server-rendered ReactNode, so every public page
 * stays a React Server Component and only this thin shell ships to the browser.
 *
 * The from-state lives in CSS (`globals.css`, gated on `.motion-ok`), not in
 * JS. Hiding elements after hydration would flash the content first; hiding
 * them in the stylesheet means the very first paint is already correct, and a
 * browser with no JS, a failed GSAP load, or `prefers-reduced-motion` simply
 * never gets the class and sees everything.
 *
 * Mark what should move with `data-reveal-item` in the page's server JSX
 * (`"up"` for copy, `"rule"` for a gold rule); the wrapper finds them.
 */

type RevealVars = gsap.TweenVars;

/** Target vars per preset. The *from* state is the CSS rule, not these. */
function varsFor(el: Element): RevealVars {
  const preset =
    el.getAttribute("data-reveal-item") ?? el.getAttribute("data-reveal");

  switch (preset) {
    case "rule":
      return {
        opacity: 1,
        scaleX: 1,
        duration: MOTION.duration.rule,
        ease: MOTION.ease.rule,
      };

    // An SVG path drawing itself. The path carries `pathLength="1"`, so the
    // dash maths is unit-free and one rule in CSS covers paths of any length.
    case "draw":
      return {
        strokeDashoffset: 0,
        duration: MOTION.duration.draw,
        ease: MOTION.ease.draw,
      };

    // Opacity only. Inside an SVG a `translate` is measured in user units, not
    // px, so the rise preset would move by an amount that changes with the
    // viewBox scale. Anything drawn rather than typeset uses this instead.
    case "fade":
      return {
        opacity: 1,
        duration: MOTION.duration.reveal,
        ease: MOTION.ease.reveal,
      };

    default:
      return {
        opacity: 1,
        y: 0,
        duration: MOTION.duration.reveal,
        ease: MOTION.ease.reveal,
      };
  }
}

/**
 * Absolute timeline position from `data-reveal-delay`, or `null` when the
 * attribute is absent (caller falls back to index stagger).
 *
 * When present — including `0` — the delay owns the slot. That lets the hero
 * motif choreograph piers and the span without the list stagger stacking on
 * top; lists omit the attribute and keep reading-order stagger.
 */
function absoluteAt(el: Element): number | null {
  const raw = el.getAttribute("data-reveal-delay");
  if (raw === null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Hands an element back to the stylesheet once it has arrived.
 *
 * Order matters: drop the attribute *first* so the `.motion-ok [data-reveal]`
 * rule stops matching, then clear the inline styles. Clearing first would let
 * the CSS re-hide the element. Clearing at all matters because a lingering
 * inline `transform` creates a containing block, which silently breaks the
 * `position: sticky` headings on /thinking and the /about portrait.
 */
function settle(el: Element) {
  el.removeAttribute("data-reveal");
  el.removeAttribute("data-reveal-item");
  gsap.set(el, { clearProps: "opacity,transform" });
}

function items(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>("[data-reveal-item]"));
}

/**
 * Scroll-triggered reveal. Fires once when the element reaches the viewport
 * reading line (`MOTION.scrollTrigger.start`) and never again.
 *
 * - Default: animates the wrapper itself as one block.
 * - `stagger`: leaves the wrapper alone and animates its `[data-reveal-item]`
 *   descendants in sequence — for lists, grids, and row stacks.
 * - `replay`: re-runs on every re-entry, including scrolling back up.
 *
 * `replay` is a deliberate exception to `MOTION.scrollTrigger.once` and is for
 * *drawn ornament only* — the hero motif. Text that re-animates every time it
 * re-enters the viewport is the thing the once-rule exists to prevent: it turns
 * reading into a slideshow. Do not put it on copy.
 */
export function Reveal({
  stagger = false,
  replay = false,
  delay = 0,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  stagger?: boolean;
  replay?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !motionEnabled()) return;

    const targets = stagger ? items(root) : [root];
    // An empty Sanity list would otherwise leave a ScrollTrigger watching nothing.
    if (targets.length === 0) return;

    // A timeline rather than one tween with `stagger`, because a group can mix
    // presets — a gold rule drawing in alongside rows rising — and a single
    // tween can only carry one set of target vars.
    const tl = gsap.timeline({
      delay,
      // A replaying timeline is driven by the ScrollTrigger callbacks below,
      // so it starts paused rather than running once on creation.
      paused: replay,
      scrollTrigger: replay
        ? undefined
        : { trigger: root, ...MOTION.scrollTrigger },
    });
    targets.forEach((el, i) => {
      const at =
        absoluteAt(el) ??
        // Capped so a long list never turns into a queue the reader waits on.
        Math.min(i * MOTION.stagger.each, MOTION.stagger.amount);
      tl.to(
        el,
        {
          ...varsFor(el),
          // Settling hands the element back to the stylesheet, which is exactly
          // what a replaying timeline must not do — it needs its from-state.
          onComplete: replay ? undefined : () => settle(el),
        },
        at,
      );
    });

    const trigger = replay
      ? ScrollTrigger.create({
          trigger: root,
          start: MOTION.scrollTrigger.start,
          onEnter: () => tl.restart(),
          onEnterBack: () => tl.restart(),
        })
      : null;

    return () => {
      trigger?.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [stagger, replay, delay]);

  return (
    <div
      ref={ref}
      // Present at first paint so the CSS gate can hide it before it is seen.
      data-reveal={stagger ? undefined : "up"}
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Entrance for content that is already in view on load — the home hero and
 * every inner-page banner. No ScrollTrigger: it runs on mount, stepping through
 * its `[data-reveal-item]` children so the kicker, headline, rule, and standfirst
 * arrive in reading order rather than all at once.
 */
export function PageEnter({
  delay = 0,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !motionEnabled()) return;

    const targets = items(root);
    if (targets.length === 0) return;

    const tl = gsap.timeline({ delay });
    targets.forEach((el, i) => {
      const at = absoluteAt(el) ?? i * MOTION.enterStep;
      tl.to(
        el,
        { ...varsFor(el), onComplete: () => settle(el) },
        at,
      );
    });

    return () => {
      tl.kill();
    };
  }, [delay]);

  return (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  );
}
