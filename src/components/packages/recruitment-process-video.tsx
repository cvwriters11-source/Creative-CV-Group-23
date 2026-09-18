"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";

const SCENE_MS = 4500;

const scenes = [
  {
    src: "/images/process/01-package.jpg",
    title: "Choose your package",
    copy: "Pick the CV that matches your career stage.",
  },
  {
    src: "/images/process/02-brief.jpg",
    title: "Share your story",
    copy: "Send your details, picture, and current CV.",
  },
  {
    src: "/images/process/03-writing.jpg",
    title: "We write your CV",
    copy: "A specialist crafts a recruiter-ready document.",
  },
  {
    src: "/images/process/04-ats.jpg",
    title: "Recruiters shortlist you",
    copy: "ATS-friendly formatting gets you through the screen.",
  },
  {
    src: "/images/process/05-interview.jpg",
    title: "You interview",
    copy: "Walk in with a CV that already made the case.",
  },
  {
    src: "/images/process/06-hired.jpg",
    title: "You get the offer",
    copy: "From first order to hired — that’s the process.",
  },
] as const;

const TOTAL_MS = scenes.length * SCENE_MS;

function formatClock(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return `0:${String(seconds).padStart(2, "0")}`;
}

export function RecruitmentProcessVideo({
  variant = "framed",
}: {
  variant?: "framed" | "background";
}) {
  const labelId = useId();
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const isBackground = variant === "background";

  const sceneIndex = Math.min(scenes.length - 1, Math.floor(elapsed / SCENE_MS));
  const scene = scenes[sceneIndex];
  const progress = elapsed / TOTAL_MS;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReducedMotion(media.matches);
      if (media.matches) setPlaying(false);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion) return;

    const timer = window.setInterval(() => {
      setElapsed((current) => (current + 100) % TOTAL_MS);
    }, 100);

    const onHidden = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", onHidden);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [playing, reducedMotion]);

  const toggle = useCallback(() => {
    setPlaying((current) => !current);
  }, []);

  const seek = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    setElapsed(ratio * TOTAL_MS);
  }, []);

  const frames = scenes.map((item, index) => {
    const active = index === sceneIndex;
    return (
      <div key={item.src} className={cn("absolute inset-0", active ? "z-[1]" : "z-0")} aria-hidden={!active}>
        <img
          src={item.src}
          alt=""
          className={cn(
            "h-full w-full object-cover",
            active && !reducedMotion && "process-film-frame",
            active ? "opacity-100" : "opacity-0",
            reducedMotion ? "" : "transition-opacity duration-700",
          )}
        />
      </div>
    );
  });

  const controls = (
    <div className="flex items-center gap-3 bg-[#07111f] px-4 py-3">
      <button
        type="button"
        onClick={toggle}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent hover:bg-accent-hover"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
      </button>
      {isBackground ? (
        <p className="hidden min-w-0 flex-1 truncate text-xs font-semibold uppercase tracking-[0.14em] text-gold sm:block">
          {String(sceneIndex + 1).padStart(2, "0")} · {scene.title}
        </p>
      ) : null}
      <p className="w-16 shrink-0 text-xs tabular-nums text-ink-soft">
        {formatClock(elapsed)} / {formatClock(TOTAL_MS)}
      </p>
      <div
        role="slider"
        aria-label="Film timeline"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        tabIndex={0}
        className={cn(
          "relative h-2 cursor-pointer rounded-full bg-white/15",
          isBackground ? "flex-1 sm:max-w-xs sm:flex-none sm:basis-64" : "flex-1",
        )}
        onPointerDown={seek}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            setElapsed((current) => Math.min(TOTAL_MS - 50, current + SCENE_MS));
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            setElapsed((current) => Math.max(0, current - SCENE_MS));
          }
        }}
      >
        <div className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${progress * 100}%` }} />
        {scenes.map((item, index) => (
          <span
            key={item.src}
            className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80"
            style={{ left: `${((index + 0.5) / scenes.length) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );

  if (isBackground) {
    return (
      <>
        <div
          role="region"
          aria-labelledby={labelId}
          className="absolute inset-0 z-0 h-full min-h-[calc(100dvh-5rem)] w-full overflow-hidden"
        >
          <p id={labelId} className="sr-only">
            Recruitment process film, from choosing a package to getting hired
          </p>
          {frames}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
            <div className="absolute inset-0 hidden bg-gradient-to-r from-[#020617]/90 via-charcoal/55 to-accent/20 md:block" />
            <div className="absolute inset-0 hidden bg-gradient-to-t from-charcoal/80 via-transparent to-accent/15 md:block" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/85 via-charcoal/55 to-charcoal/70 md:hidden" />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
          <div className="pointer-events-auto">{controls}</div>
        </div>
      </>
    );
  }

  return (
    <div
      role="region"
      aria-labelledby={labelId}
      className="recruitment-film relative overflow-hidden rounded-[1.6rem] border border-accent/35 bg-paper-deep shadow-[0_24px_60px_rgba(2,6,23,0.45)]"
    >
      <p id={labelId} className="sr-only">
        Recruitment process film, from choosing a package to getting hired
      </p>

      <div className="relative aspect-video overflow-hidden">
        {frames}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/25 to-transparent"
        />

        <p className="absolute left-4 top-4 rounded-full bg-paper-deep/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
          Recruitment process
        </p>
        <p className="absolute right-4 top-4 rounded-full bg-paper-deep/80 px-3 py-1 text-[10px] font-semibold tabular-nums text-white/90 backdrop-blur-sm">
          {String(sceneIndex + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
        </p>

        <button
          type="button"
          onClick={toggle}
          className="absolute inset-0 z-[2] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-gold"
          aria-label={playing ? "Pause recruitment process film" : "Play recruitment process film"}
        >
          {playing ? null : (
            <span className="inline-flex size-16 items-center justify-center rounded-full bg-accent text-on-accent shadow-lg">
              <Play size={28} fill="currentColor" className="ml-0.5" />
            </span>
          )}
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] px-4 pb-4 pt-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
            {String(sceneIndex + 1).padStart(2, "0")} · {scene.title}
          </p>
          <p className="mt-1 max-w-md font-serif text-xl leading-tight text-white sm:text-2xl">{scene.copy}</p>
        </div>
      </div>

      {controls}
    </div>
  );
}
