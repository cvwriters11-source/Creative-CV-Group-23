import { cn } from "@/lib/cn";
import {
  cvColorLabel,
  cvColorMeta,
  formatCvDesign,
  graduatePdfPages,
  graduatePreviewSrc,
  isCvColorId,
  sampleCvPreview,
  type CvColorId,
  type CvTemplateId,
} from "@/lib/cv-design";

type Size = "card" | "stage" | "document";

export function GraduatePdfPreview({
  color,
  className,
}: {
  color: CvColorId;
  className?: string;
}) {
  const label = cvColorLabel(color);
  const total = graduatePdfPages.length;

  return (
    <div
      className={cn(
        "h-full overflow-y-auto overscroll-contain bg-[#d8dde3] p-2 [scrollbar-width:thin]",
        className,
      )}
    >
      <div className="space-y-3">
        {graduatePdfPages.map((page) => (
          <figure key={page} className="overflow-hidden bg-white shadow-[0_8px_20px_rgba(15,23,42,0.18)]">
            <img
              src={graduatePreviewSrc(page, color)}
              alt={`${label} International Resume, page ${page} of ${total}`}
              className="block w-full"
              suppressHydrationWarning
            />
            <figcaption className="border-t border-slate-200 bg-white px-2 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Page {page} of {total}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export function ChosenCvPages({
  color,
  template,
  className,
  tone = "admin",
  size = "compact",
}: {
  color?: string;
  template?: string;
  className?: string;
  tone?: "admin" | "light";
  size?: "compact" | "full";
}) {
  if (!isCvColorId(color ?? "")) return null;
  const id = color as CvColorId;
  const label = formatCvDesign(template || "classic", id);
  const total = graduatePdfPages.length;
  const light = tone === "light";
  const compact = size === "compact";

  return (
    <div
      className={cn(
        "rounded-xl border",
        light ? "border-accent/30 bg-paper-deep" : "border-accent/25 bg-white/5",
        compact ? "px-3 py-2.5" : "p-3",
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-accent">Client chose this CV</p>
        <p className={cn("text-xs font-semibold", light ? "text-ink" : "text-white")}>
          {label} · {total} pages
        </p>
      </div>
      <div className={cn("mt-2.5 flex flex-wrap gap-2.5", compact ? "items-start" : "grid sm:grid-cols-2")}>
        {graduatePdfPages.map((page) => (
          <figure
            key={page}
            className={cn(
              "overflow-hidden rounded-lg bg-white ring-1 ring-black/10",
              compact ? "w-[6.75rem] shrink-0 sm:w-[7.5rem]" : "w-full",
            )}
          >
            <img
              src={graduatePreviewSrc(page, id)}
              alt={`${label}, page ${page} of ${total}`}
              className="block w-full"
            />
            <figcaption className="border-t border-slate-200 bg-slate-50 px-1.5 py-1 text-center text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              {page}/{total}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function GraduateSample({ size, color }: { size: Size; color: CvColorId }) {
  if (size === "card" || size === "document" || size === "stage") {
    return <GraduatePdfPreview color={color} />;
  }
  return null;
}

function SectionTitle({
  children,
  color,
  layout,
}: {
  children: string;
  color: string;
  layout: CvTemplateId;
}) {
  if (layout === "banner") {
    return (
      <p className="mt-[0.7em] text-[0.72em] font-extrabold uppercase tracking-[0.12em]" style={{ color }}>
        {children}
      </p>
    );
  }
  return (
    <p className="mt-[0.7em] text-[0.7em] font-extrabold uppercase tracking-[0.16em]" style={{ color }}>
      {children}
    </p>
  );
}

function BodyCopy({ layout, color }: { layout: CvTemplateId; color: CvColorId }) {
  const cv = sampleCvPreview;
  const accent = cvColorMeta(color).hex;
  const onSidebar = layout === "sidebar";

  return (
    <div className={cn("min-w-0 text-[#1c2430]", onSidebar ? "px-[0.7em] py-[0.65em]" : "")}>
      {layout === "executive" ? (
        <>
          <p className="text-[1.28em] font-bold leading-tight tracking-tight text-[#0f172a]">{cv.name}</p>
          <p className="mt-[0.1em] text-[0.78em] font-semibold" style={{ color: accent }}>
            {cv.headline}
          </p>
          <p className="mt-[0.2em] text-[0.62em] text-[#64748b]">{cv.contact}</p>
        </>
      ) : null}

      {layout !== "sidebar" ? (
        <>
          <SectionTitle color={accent} layout={layout}>
            Personal Summary
          </SectionTitle>
          <p className="mt-[0.28em] text-[0.68em] leading-snug text-[#334155]">{cv.summary}</p>
        </>
      ) : (
        <p className="text-[0.68em] leading-snug text-[#334155]">{cv.summary}</p>
      )}

      <SectionTitle color={accent} layout={layout}>
        Education
      </SectionTitle>
      <p className="mt-[0.22em] text-[0.66em] leading-snug text-[#334155]">{cv.education}</p>

      {layout !== "sidebar" ? (
        <>
          <SectionTitle color={accent} layout={layout}>
            Key Skills
          </SectionTitle>
          <ul className="mt-[0.2em] grid grid-cols-2 gap-x-[0.5em] text-[0.64em] text-[#334155]">
            {cv.skills.map((skill) => (
              <li key={skill}>• {skill}</li>
            ))}
          </ul>
        </>
      ) : null}

      <SectionTitle color={accent} layout={layout}>
        Experience
      </SectionTitle>
      <div className="mt-[0.2em] flex items-baseline justify-between gap-[0.4em]">
        <p className="text-[0.66em] font-bold text-[#0f172a]">{cv.roleCompany}</p>
        <p className="shrink-0 text-[0.58em] text-[#64748b]">{cv.roleDates}</p>
      </div>
      <p className="text-[0.64em] font-semibold" style={{ color: accent }}>
        {cv.roleTitle}
      </p>
      <p className="mt-[0.12em] text-[0.64em] leading-snug text-[#334155]">• {cv.roleBullet}</p>
    </div>
  );
}

export function CvDesignPreview({
  template,
  color,
  size = "card",
}: {
  template: CvTemplateId;
  color: CvColorId;
  size?: Size;
}) {
  const theme = cvColorMeta(color);
  const chrome = color === "chrome";
  const headerFill = chrome
    ? "linear-gradient(180deg, #d7dbe1 0%, #9aa3ad 52%, #7b838d 100%)"
    : theme.hex;

  if (template === "classic") {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-md bg-[#d8dde3] text-left shadow-[0_10px_28px_rgba(2,6,23,0.28)] ring-1 ring-black/10",
          size === "document" || size === "stage" ? "h-full min-h-[28rem]" : "h-full",
        )}
      >
        <GraduateSample size={size} color={color} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md bg-white text-left shadow-[0_10px_28px_rgba(2,6,23,0.28)] ring-1 ring-black/10",
        size === "card" ? "aspect-[210/297]" : "aspect-[210/297] max-h-[min(70vh,36rem)]",
      )}
    >
      <article
        className={cn(
          "flex h-full min-h-0 w-full flex-col overflow-hidden",
          size === "card" ? "text-[6.2px] sm:text-[7.2px]" : "text-[8.5px] sm:text-[10px] md:text-[11.5px]",
        )}
        suppressHydrationWarning
      >

        {template === "banner" ? (
          <header className="px-[0.85em] py-[0.75em]" style={{ background: headerFill, color: theme.ink }}>
            <p className="text-[1.35em] font-bold leading-tight">{sampleCvPreview.name}</p>
            <p className="mt-[0.12em] text-[0.78em] font-semibold opacity-90">{sampleCvPreview.headline}</p>
            <p className="mt-[0.2em] text-[0.62em] opacity-80">{sampleCvPreview.contact}</p>
          </header>
        ) : null}

        {template === "sidebar" ? (
          <div className="flex min-h-0 flex-1">
            <aside className="flex w-[34%] flex-col px-[0.55em] py-[0.7em]" style={{ background: headerFill, color: theme.ink }}>
              <span
                className="mb-[0.55em] size-[2.4em] rounded-full"
                style={{ background: chrome ? "rgba(15,23,42,0.2)" : "rgba(255,255,255,0.22)" }}
                aria-hidden
              />
              <p className="text-[1.05em] font-bold leading-tight">{sampleCvPreview.name}</p>
              <p className="mt-[0.15em] text-[0.68em] font-semibold opacity-90">{sampleCvPreview.headline}</p>
              <p className="mt-[0.55em] text-[0.55em] font-extrabold uppercase tracking-[0.14em] opacity-80">Contact</p>
              <p className="mt-[0.2em] text-[0.58em] leading-snug opacity-90">Johannesburg</p>
              <p className="text-[0.58em] leading-snug opacity-90">074 000 0000</p>
              <p className="text-[0.58em] leading-snug opacity-90">thabo@email.com</p>
              <p className="mt-[0.65em] text-[0.55em] font-extrabold uppercase tracking-[0.14em] opacity-80">Skills</p>
              <ul className="mt-[0.2em] space-y-[0.12em] text-[0.58em] leading-snug opacity-90">
                {sampleCvPreview.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </aside>
            <BodyCopy layout={template} color={color} />
          </div>
        ) : template === "executive" ? (
          <div className="flex min-h-0 flex-1">
            <div className="w-[0.55em] shrink-0" style={{ background: headerFill }} aria-hidden />
            <div className="min-w-0 flex-1 px-[0.8em] py-[0.7em]">
              <BodyCopy layout={template} color={color} />
            </div>
          </div>
        ) : template === "banner" ? (
          <div className="min-h-0 flex-1 px-[0.8em] pb-[0.7em] pt-[0.45em]">
            <BodyCopy layout={template} color={color} />
          </div>
        ) : null}
      </article>
    </div>
  );
}
