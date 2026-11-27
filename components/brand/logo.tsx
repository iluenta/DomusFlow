import Link from "next/link";

import { cn } from "cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-8 shrink-0", className)}
    >
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <path
        d="M9 22V10h3v4.4h8V10h3v12h-3v-4.4h-8V22H9Z"
        fill="var(--primary-foreground)"
      />
      <path
        d="M10 26c3.6-2 8.4-2 12 0"
        fill="none"
        stroke="var(--primary-foreground)"
        strokeLinecap="round"
        strokeWidth="1.6"
        opacity="0.55"
      />
    </svg>
  );
}

export function Logo({
  className,
  href,
  showWordmark = true,
}: {
  className?: string;
  href?: string;
  showWordmark?: boolean;
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {showWordmark ? (
        <span className="font-heading text-[1.0625rem] font-semibold tracking-tight text-foreground">
          Hospyia
        </span>
      ) : null}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        aria-label="Hospyia, ir al panel"
      >
        {content}
      </Link>
    );
  }

  return content;
}
