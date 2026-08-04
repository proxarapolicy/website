"use client";

import { useState, type ReactNode } from "react";
import { Check, Link2, Mail } from "lucide-react";

import { cn } from "@/lib/utils";

type EssayShareProps = {
  title: string;
  url: string;
  className?: string;
};

/**
 * Share controls for essays. LinkedIn / X / email are plain links (no JS).
 * Copy-link is the only interactive bit — allowed as a small client island.
 */
export function EssayShare({ title, url, className }: EssayShareProps) {
  const [copied, setCopied] = useState(false);

  const linkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const xShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const email = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${url}`)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can fail in insecure contexts — leave button as-is.
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <p className="eyebrow mr-2 text-muted-foreground">Share</p>
      <ShareLink href={linkedIn} label="Share on LinkedIn">
        LinkedIn
      </ShareLink>
      <ShareLink href={xShare} label="Share on X">
        X
      </ShareLink>
      <ShareLink href={email} label="Share by email">
        <Mail className="size-3.5" aria-hidden />
        Email
      </ShareLink>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex h-9 items-center gap-1.5 border border-border bg-background px-3 text-sm text-navy transition-colors hover:border-gold hover:bg-surface-navy-wash"
      >
        {copied ? (
          <Check className="size-3.5 text-gold-deep" aria-hidden />
        ) : (
          <Link2 className="size-3.5" aria-hidden />
        )}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

function ShareLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      aria-label={label}
      className="inline-flex h-9 items-center gap-1.5 border border-border bg-background px-3 text-sm text-navy transition-colors hover:border-gold hover:bg-surface-navy-wash"
    >
      {children}
    </a>
  );
}
