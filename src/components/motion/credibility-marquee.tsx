"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import { Mark } from "@/components/site/mark";
import { MOTION } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Continuously scrolling credibility rail.
 *
 * The one perpetual animation on the site — everything else fires once. It is
 * here because a static list of four names reads as a footnote, while a slow
 * rail reads as a roster. Speed is deliberately low (`MOTION.marqueeSpeed`) so
 * every name is legible at a glance rather than swept past.
 *
 * Three copies of the list are rendered. Two would be the minimum for a
 * seamless loop, but only if one copy is at least as wide as the viewport;
 * three keeps the seam covered on ultrawide screens with a short list.
 *
 * Accessibility: only the first copy is exposed to assistive tech, the rail
 * pauses on hover and on keyboard focus, and `prefers-reduced-motion` drops the
 * animation entirely — the CSS in globals.css then wraps the single copy into a
 * plain static row.
 */
const COPIES = 3;

export function CredibilityMarquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const build = () => {
      tweenRef.current?.kill();
      gsap.set(track, { x: 0 });

      const copies = track.querySelectorAll<HTMLElement>("[data-marquee-copy]");
      if (copies.length < 2) return;

      // Exact loop distance: where the second copy starts relative to the
      // first. Deriving it from scrollWidth / COPIES would be off by the gap at
      // the seam, and the drift shows up as a stutter once per cycle.
      const distance = copies[1].offsetLeft - copies[0].offsetLeft;
      if (distance <= 0) return;

      // Constant speed regardless of how many names the client adds.
      tweenRef.current = gsap.to(track, {
        x: -distance,
        duration: distance / MOTION.marqueeSpeed,
        ease: "none",
        repeat: -1,
      });
    };

    build();

    // Name widths change with the responsive type scale, so a viewport change
    // invalidates the measured distance.
    const observer = new ResizeObserver(build);
    observer.observe(track);

    return () => {
      observer.disconnect();
      tweenRef.current?.kill();
      tweenRef.current = null;
    };
  }, [items]);

  const pause = () => tweenRef.current?.pause();
  const resume = () => tweenRef.current?.resume();

  return (
    <div
      className={cn("overflow-hidden", className)}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
    >
      <div
        ref={trackRef}
        data-marquee-track
        className="flex w-max will-change-transform"
      >
        {Array.from({ length: COPIES }, (_, copy) => (
          <ul
            key={copy}
            data-marquee-copy
            className="flex shrink-0 items-center"
            // Only the first copy is real content; the rest are visual filler.
            aria-hidden={copy > 0 || undefined}
          >
            {items.map((item) => (
              <li
                key={item}
                className="flex shrink-0 items-center gap-6 pr-6 md:gap-10 md:pr-10"
              >
                <span className="font-serif text-base whitespace-nowrap text-navy md:text-lg">
                  {item}
                </span>
                <Mark className="size-2 shrink-0 text-gold-deep" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
