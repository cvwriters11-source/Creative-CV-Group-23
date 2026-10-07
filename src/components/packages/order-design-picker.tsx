"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { GraduatePdfPreview } from "@/components/packages/cv-design-preview";
import { cn } from "@/lib/cn";
import { cvColors, isCvColorId, type CvColorId } from "@/lib/cv-design";
import { packageOrderHref, type AddonId, type PackageId } from "@/lib/packages";

function swatch(id: CvColorId, hex: string) {
  return id === "chrome"
    ? "linear-gradient(145deg, #e8eaee 0%, #9aa3ad 48%, #6d757e 100%)"
    : hex;
}

export function OrderDesignPicker({
  initialColor,
  packageId,
  addonIds,
}: {
  initialColor: CvColorId;
  packageId: PackageId;
  addonIds: AddonId[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const skipScrollSync = useRef(false);
  const skipTimer = useRef<number>(0);
  const didAlign = useRef(false);
  const [color, setColor] = useState<CvColorId>(initialColor);
  const index = Math.max(
    0,
    cvColors.findIndex((item) => item.id === color),
  );
  const prev = cvColors[(index - 1 + cvColors.length) % cvColors.length];
  const next = cvColors[(index + 1) % cvColors.length];
  const selected = cvColors[index];

  const colourHref = useCallback(
    (id: CvColorId) =>
      packageOrderHref(packageId, addonIds, { template: "classic", color: id, step: "colour" }),
    [addonIds, packageId],
  );
  const continueHref = packageOrderHref(packageId, addonIds, {
    template: "classic",
    color,
    step: "details",
  });

  const alignSlide = useCallback((id: CvColorId, behavior: ScrollBehavior = "smooth") => {
    const root = scrollerRef.current;
    const slide = root?.querySelector<HTMLElement>(`[data-color="${id}"]`);
    if (!root || !slide) return;
    const rootRect = root.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const delta = slideRect.left + slideRect.width / 2 - (rootRect.left + rootRect.width / 2);
    root.scrollTo({ left: root.scrollLeft + delta, behavior });
  }, []);

  const choose = useCallback(
    (id: CvColorId) => {
      setColor(id);
      skipScrollSync.current = true;
      window.clearTimeout(skipTimer.current);
      skipTimer.current = window.setTimeout(() => {
        skipScrollSync.current = false;
      }, 420);
      alignSlide(id);
    },
    [alignSlide],
  );

  useEffect(() => {
    if (didAlign.current) return;
    didAlign.current = true;
    alignSlide(initialColor, "instant");
  }, [alignSlide, initialColor]);

  useEffect(() => {
    const nextUrl = colourHref(color);
    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [color, colourHref]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    let frame = 0;
    const syncFromScroll = () => {
      frame = 0;
      if (skipScrollSync.current) return;
      const bounds = root.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      let nextColor: CvColorId | undefined;
      let dist = Infinity;
      root.querySelectorAll<HTMLElement>("[data-color]").forEach((el) => {
        const id = el.dataset.color;
        if (!id || !isCvColorId(id)) return;
        const rect = el.getBoundingClientRect();
        const gap = Math.abs(rect.left + rect.width / 2 - centerX);
        if (gap < dist) {
          dist = gap;
          nextColor = id;
        }
      });
      if (nextColor) {
        const selected = nextColor;
        setColor((current) => (current === selected ? current : selected));
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(syncFromScroll);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      root.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(skipTimer.current);
    };
  }, []);

  return (
    <section className="mt-8 pb-20">
      <p className="kicker">Choose your CV</p>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Swipe the samples or tap one to select it. Scroll inside a sample to read both pages, then continue.
      </p>

      <div className="mt-6">
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cvColors.map((item) => {
            const active = color === item.id;
            return (
              <article
                key={item.id}
                data-color={item.id}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "flex w-[min(22rem,calc(100%-1.5rem))] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border bg-paper-deep p-3 shadow-[0_12px_32px_rgba(2,6,23,0.28)] transition",
                  active ? "border-accent ring-2 ring-accent" : "border-accent/30",
                )}
              >
                <div className="h-[min(62vh,36rem)] overflow-hidden rounded-md ring-1 ring-black/10">
                  <GraduatePdfPreview color={item.id} />
                </div>
                <button
                  type="button"
                  onPointerDown={(event) => {
                    if (event.button !== 0) return;
                    event.preventDefault();
                    choose(item.id);
                  }}
                  onClick={() => choose(item.id)}
                  aria-pressed={active}
                  className={cn(
                    "mt-3 flex min-h-12 w-full touch-manipulation items-center justify-between gap-2 rounded-xl px-1 text-left",
                    active ? "" : "hover:bg-white/5",
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="size-4 shrink-0 rounded-full ring-2 ring-white/20"
                      style={{ background: swatch(item.id, item.hex) }}
                      aria-hidden
                    />
                    <span className="truncate font-serif text-lg font-semibold text-ink">{item.name}</span>
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em]",
                      active
                        ? "bg-accent text-on-accent"
                        : "border border-accent/40 text-ink",
                    )}
                  >
                    {active ? (
                      <>
                        <Check className="size-3.5" strokeWidth={3} />
                        Selected
                      </>
                    ) : (
                      "Tap to choose"
                    )}
                  </span>
                </button>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            choose(prev.id);
          }}
          onClick={() => choose(prev.id)}
          aria-label={`Previous CV, ${prev.name}`}
          className="inline-flex size-11 touch-manipulation items-center justify-center rounded-full border border-accent/40 bg-paper-deep text-ink hover:border-accent hover:bg-accent hover:text-on-accent"
        >
          <ChevronLeft className="size-5" strokeWidth={2.25} />
        </button>
        <div className="flex items-center gap-2">
          {cvColors.map((item) => {
            const active = color === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onPointerDown={(event) => {
                  if (event.button !== 0) return;
                  event.preventDefault();
                  choose(item.id);
                }}
                onClick={() => choose(item.id)}
                aria-label={`Choose ${item.name} CV`}
                aria-pressed={active}
                className={cn(
                  "size-3 touch-manipulation rounded-full transition",
                  active ? "bg-accent ring-2 ring-accent/40 ring-offset-2 ring-offset-paper" : "bg-ink/25 hover:bg-ink/50",
                )}
              />
            );
          })}
        </div>
        <button
          type="button"
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            choose(next.id);
          }}
          onClick={() => choose(next.id)}
          aria-label={`Next CV, ${next.name}`}
          className="inline-flex size-11 touch-manipulation items-center justify-center rounded-full border border-accent/40 bg-paper-deep text-ink hover:border-accent hover:bg-accent hover:text-on-accent"
        >
          <ChevronRight className="size-5" strokeWidth={2.25} />
        </button>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={continueHref}
          className="rounded-full bg-accent px-7 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-on-accent hover:bg-accent-hover"
        >
          Continue with {selected.name}
        </a>
        <p className="text-sm text-ink-soft">Selected CV: International · {selected.name} · 2 pages</p>
      </div>
    </section>
  );
}
