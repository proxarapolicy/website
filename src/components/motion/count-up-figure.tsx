"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import { MOTION, cancelMotionFailsafe, motionEnabled } from "@/lib/motion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== "undefined") cancelMotionFailsafe();

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Zero-padded figure that counts from 00 to `value` once when it enters the
 * viewport. SSR and reduced-motion render the final number immediately.
 * Tabular figures keep the glyph width stable while the digits change.
 */
export function CountUpFigure({
  value,
  className,
  ...props
}: {
  value: number;
  className?: string;
} & Omit<React.ComponentProps<"span">, "children">) {
  const ref = useRef<HTMLSpanElement>(null);
  const target = Math.max(0, Math.round(value));

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!motionEnabled()) {
      el.textContent = pad2(target);
      return;
    }

    el.textContent = pad2(0);
    const state = { n: 0 };

    const tween = gsap.to(state, {
      n: target,
      duration: MOTION.duration.count,
      ease: MOTION.ease.count,
      scrollTrigger: {
        trigger: el,
        ...MOTION.scrollTrigger,
      },
      onUpdate: () => {
        el.textContent = pad2(Math.round(state.n));
      },
      onComplete: () => {
        el.textContent = pad2(target);
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [target]);

  return (
    <span
      ref={ref}
      className={cn("figures-tabular", className)}
      {...props}
    >
      {pad2(target)}
    </span>
  );
}
