import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "ink" | "accent" | "ghost" | "paper" | "brand" | "outline" | "outlineLight";
  className?: string;
};

export function ButtonLink({ href, children, variant = "ink", className }: Props) {
  const styles = {
    ink: "bg-steel text-ink hover:bg-steel-hover",
    accent: "bg-accent text-ink hover:bg-accent-hover",
    ghost: "border border-accent/40 bg-transparent text-ink hover:border-accent hover:bg-accent-soft hover:text-ink",
    paper: "bg-paper-deep text-ink hover:bg-wash",
    brand: "bg-brand text-ink hover:bg-brand-hover",
    outline: "border-2 border-accent bg-transparent text-ink hover:bg-accent hover:text-ink",
    outlineLight: "border-2 border-gold bg-transparent text-ink hover:bg-gold hover:text-ink",
  } as const;

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        styles[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function PageIntro({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <p className="kicker">{eyebrow}</p> : null}
      <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl">{title}</h1>
      <div className="brand-rule mt-4" aria-hidden />
      {lede ? <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{lede}</p> : null}
    </div>
  );
}
