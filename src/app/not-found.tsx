import Link from "next/link";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="bg-wash">
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="kicker">{site.name}</p>
        <h1 className="mt-4 font-serif text-5xl">Page not found</h1>
        <div className="brand-rule mx-auto mt-4" aria-hidden />
        <p className="mt-4 text-ink-soft">That page isn’t on Creative CV. Try packages, jobs, or the generator.</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-accent px-5 py-3 text-sm text-ink hover:bg-accent-hover"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
