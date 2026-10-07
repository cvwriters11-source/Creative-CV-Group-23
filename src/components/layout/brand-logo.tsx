import { cn } from "@/lib/cn";

export function BrandLogo({
  className,
  alt = "Creative-CV Group of Recruiters",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    // Native img avoids next/image `color: transparent` hydrating differently under color-scheme: dark.
    // suppressHydrationWarning: Cursor's preview injects data-cursor-ref on the logo before React hydrates.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.jpg"
      alt={alt}
      width={720}
      height={480}
      className={cn("[color-scheme:light]", className)}
      suppressHydrationWarning
    />
  );
}
