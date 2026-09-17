"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { cn } from "@/lib/cn";

const INTERVAL_MS = 5000;

const slides = [
  {
    src: "/images/hero.jpg",
    alt: "Professionals in a career consultation reviewing CV documents",
    position: "object-[68%_18%]",
  },
  {
    src: "/images/hero-2.jpg",
    alt: "Career coach and job seeker reviewing a CV together at a desk",
    position: "object-[center_28%]",
  },
  {
    src: "/images/hero-3.jpg",
    alt: "Candidate in a professional job interview with two hiring managers",
    position: "object-[center_30%]",
  },
  {
    src: "/images/hero-4.jpg",
    alt: "Two professionals reviewing career documents at a conference table",
    position: "object-[center_28%]",
  },
  {
    src: "/images/hero-5.jpg",
    alt: "Job seeker preparing application documents on a laptop",
    position: "object-[center_22%]",
  },
  {
    src: "/images/hero-6.jpg",
    alt: "Candidate and hiring manager shaking hands after an interview",
    position: "object-[center_28%]",
  },
] as const;

type HeroSlideshowProps = {
  variant?: "framed" | "background";
};

export function HeroSlideshow({ variant = "framed" }: HeroSlideshowProps) {
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [announce, setAnnounce] = useState(false);
  const paused = hovering || focusInside || hidden;
  const isBackground = variant === "background";

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(media.matches);
    syncMotion();
    media.addEventListener("change", syncMotion);

    const syncHidden = () => setHidden(document.hidden);
    syncHidden();
    document.addEventListener("visibilitychange", syncHidden);

    return () => {
      media.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncHidden);
    };
  }, []);

  const goTo = useCallback((next: number, fromUser = false) => {
    const total = slides.length;
    setIndex(((next % total) + total) % total);
    if (fromUser) setAnnounce(true);
  }, []);

  useEffect(() => {
    if (reducedMotion || paused) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1, true);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1, true);
    }
  };

  const pauseHandlers = {
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
    onFocus: () => setFocusInside(true),
    onBlur: (event: React.FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        setFocusInside(false);
      }
    },
    onKeyDown,
  };

  const slideImages = slides.map((slide, slideIndex) => {
    const active = slideIndex === index;
    return (
      <div
        key={slide.src}
        role="group"
        aria-roledescription="slide"
        aria-label={`${slideIndex + 1} of ${slides.length}`}
        aria-hidden={!active}
        className={cn("absolute inset-0", active ? "z-[1]" : "z-0")}
      >
        <Image
          src={slide.src}
          alt={active ? slide.alt : ""}
          fill
          priority={slideIndex === 0}
          sizes={isBackground ? "100vw" : "(min-width: 1024px) 50vw, 100vw"}
          className={cn(
            "object-cover",
            slide.position,
            reducedMotion ? "" : "transition-opacity duration-700 ease-in-out",
            active ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
    );
  });

  const overlay = isBackground ? (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
      <div className="absolute inset-0 hidden bg-gradient-to-r from-[#020617]/90 via-charcoal/55 to-accent/20 md:block" />
      <div className="absolute inset-0 hidden bg-gradient-to-t from-charcoal/80 via-transparent to-accent/15 md:block" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/85 via-charcoal/55 to-charcoal/70 md:hidden" />
    </div>
  ) : null;

  const controls = (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-center gap-2 px-3 pt-16",
        isBackground
          ? "bg-gradient-to-t from-charcoal/60 via-accent/10 to-transparent pb-5 lg:pb-6"
          : "bg-gradient-to-t from-charcoal/55 via-accent/10 to-transparent pb-4",
      )}
      {...pauseHandlers}
    >
      <button
        type="button"
        className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper-deep/90 text-ink shadow-sm backdrop-blur-sm transition hover:bg-accent hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        aria-label="Previous career photo"
        onClick={() => goTo(index - 1, true)}
      >
        <ChevronLeft size={18} strokeWidth={2.25} />
      </button>

      <div className="pointer-events-auto mb-0.5 flex items-center gap-1.5">
        {slides.map((slide, slideIndex) => {
          const selected = slideIndex === index;
          return (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show photo ${slideIndex + 1} of ${slides.length}`}
              aria-current={selected ? "true" : undefined}
              className="flex h-8 min-w-8 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              tabIndex={selected ? 0 : -1}
              onClick={() => goTo(slideIndex, true)}
            >
              <span
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  selected ? "w-6 bg-gold" : "w-2.5 bg-white/55 hover:bg-gold/80",
                )}
              />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper-deep/90 text-ink shadow-sm backdrop-blur-sm transition hover:bg-accent hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        aria-label="Next career photo"
        onClick={() => goTo(index + 1, true)}
      >
        <ChevronRight size={18} strokeWidth={2.25} />
      </button>
    </div>
  );

  const liveRegion = (
    <>
      <p id={labelId} className="sr-only">
        Career photos
      </p>
      <div className="sr-only" aria-live={announce ? "polite" : "off"} aria-atomic="true">
        Slide {index + 1} of {slides.length}: {slides[index].alt}
      </div>
    </>
  );

  if (isBackground) {
    return (
      <>
        <div
          role="region"
          aria-roledescription="carousel"
          aria-labelledby={labelId}
          className="absolute inset-0 z-0 h-full min-h-[85vh] w-full overflow-hidden"
          {...pauseHandlers}
        >
          {liveRegion}
          {slideImages}
          {overlay}
        </div>
        {controls}
      </>
    );
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      className="relative h-80 overflow-hidden rounded-3xl shadow-2xl sm:h-96 lg:h-[500px]"
      {...pauseHandlers}
    >
      {liveRegion}
      {slideImages}
      {controls}
    </div>
  );
}
