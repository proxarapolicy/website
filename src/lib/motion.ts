/**
 * Motion tokens — the whole vocabulary in one place.
 *
 * The brief is institutional, not expressive: a short fade with a felt rise,
 * staggered rows, and gold rules that draw in from the left. Nothing scrubs
 * with scroll, nothing pins, nothing moves twice. If a value here grows, the
 * motion is getting louder than the writing, which is the wrong trade.
 *
 * Keep `--motion-rise` in globals.css in lockstep with `rise` — the CSS
 * from-state must match what GSAP settles to, or the first frame jumps.
 */
export const MOTION = {
  /** Distance an element rises into place, in px. Enough travel to read as arrival. */
  rise: 28,

  duration: {
    /** fade-up and stagger items — long enough that the eye catches the settle. */
    reveal: 0.7,
    /** Gold rules drawing to full width — slightly longer so the draw is legible. */
    rule: 0.8,
    /**
     * An SVG path drawing itself — currently only the hero motif's span.
     * Longer than a rule because the eye follows the tip along the whole
     * length; at rule speed it reads as a flicker rather than as a route.
     */
    draw: 1.45,
    /** Integer count-up for numbered lists (01–05). Short — it is punctuation. */
    count: 0.85,
  },

  ease: {
    /** Strong ease-out: quick departure from the from-state, soft landing. */
    reveal: "power3.out",
    rule: "power3.out",
    /** In-out: the span leaves one pier and settles onto the other. */
    draw: "power3.inOut",
    count: "power2.out",
  },

  /** Per-item delay in a stagger, capped so long lists never feel like a queue. */
  stagger: { each: 0.1, amount: 0.7 },

  /** Gap between steps of an above-the-fold entrance timeline, in seconds. */
  enterStep: 0.09,

  /**
   * Credibility strip scroll speed, px/second. The one continuous animation on
   * the site, so it is deliberately slow — fast enough to read as alive, slow
   * enough that a minister scanning the page can still read every name.
   */
  marqueeSpeed: 45,

  /**
   * Uniform ScrollTrigger config. `once` is non-negotiable — re-firing on
   * scroll-up is what makes reveal animations feel like a gimmick.
   *
   * `top 65%` = fire only once the element's top has reached the lower-middle
   * of the viewport. A looser start (e.g. 90%) lets tall screens treat half
   * the page as "already in view" on load, so everything animates at once
   * instead of as you scroll.
   */
  scrollTrigger: { start: "top 65%", once: true },
} as const;

/** Class set by the inline script in the root layout. Its absence means "no motion". */
export const MOTION_CLASS = "motion-ok";

/**
 * True when the pre-paint gate opted this page into motion. The gate is off for
 * `prefers-reduced-motion`, and the layout's failsafe turns it off if the GSAP
 * chunk never arrives — so this single check covers both.
 */
export function motionEnabled() {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains(MOTION_CLASS)
  );
}

/**
 * Cancels the layout failsafe that un-hides everything if GSAP fails to load.
 * Called by the first motion component that successfully mounts.
 */
export function cancelMotionFailsafe() {
  const w = window as Window & { __motionFailsafe?: ReturnType<typeof setTimeout> };
  if (w.__motionFailsafe !== undefined) {
    clearTimeout(w.__motionFailsafe);
    w.__motionFailsafe = undefined;
  }
}
