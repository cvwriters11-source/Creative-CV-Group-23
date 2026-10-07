export const cvTemplates = [
  {
    id: "classic",
    name: "International",
    blurb: "The International Resume sample as we write it.",
  },
  {
    id: "banner",
    name: "Banner",
    blurb: "A full colour header across the top for a strong first impression.",
  },
  {
    id: "sidebar",
    name: "Sidebar",
    blurb: "Colour column on the left for contact and skills, story on the right.",
  },
  {
    id: "executive",
    name: "Executive",
    blurb: "Left accent rail and boardroom spacing for senior roles.",
  },
] as const;

export type CvTemplateId = (typeof cvTemplates)[number]["id"];

export const cvColors = [
  { id: "blue", name: "Blue", hex: "#1e6bb8", ink: "#ffffff" },
  { id: "chrome", name: "Chrome", hex: "#8a929c", ink: "#15181c" },
  { id: "dark-grey", name: "Dark Grey", hex: "#4b5158", ink: "#ffffff" },
  { id: "navy-blue", name: "Navy Blue", hex: "#1b365d", ink: "#ffffff" },
  { id: "dark-green", name: "Dark Green", hex: "#1a4a38", ink: "#ffffff" },
  { id: "teal", name: "Teal", hex: "#0e7c7b", ink: "#ffffff" },
] as const;

export type CvColorId = (typeof cvColors)[number]["id"];

export const sampleCvPreview = {
  name: "Thabo Naidoo",
  headline: "Financial Analyst",
  contact: "Johannesburg  ·  074 000 0000  ·  thabo@email.com",
  summary:
    "Results-driven analyst who turns monthly numbers into clear decisions for hiring managers.",
  education: "BCom Finance · University of Johannesburg · 2024",
  skills: ["Financial modelling", "Excel", "Reporting", "Stakeholder updates"],
  roleCompany: "Standard Bank · Johannesburg",
  roleTitle: "Intern Analyst",
  roleDates: "2023 – 2024",
  roleBullet: "Built reporting packs that shortened month-end review.",
};

export function isCvTemplateId(value: string): value is CvTemplateId {
  return cvTemplates.some((item) => item.id === value);
}

export function isCvColorId(value: string): value is CvColorId {
  return cvColors.some((item) => item.id === value);
}

export function parseCvTemplate(value: unknown): CvTemplateId | null {
  const id = String(value ?? "").trim();
  return isCvTemplateId(id) ? id : null;
}

export function parseCvColor(value: unknown): CvColorId | null {
  const id = String(value ?? "").trim();
  return isCvColorId(id) ? id : null;
}

export function cvTemplateLabel(id: string | undefined) {
  return cvTemplates.find((item) => item.id === id)?.name ?? id ?? "";
}

export function cvColorLabel(id: string | undefined) {
  return cvColors.find((item) => item.id === id)?.name ?? id ?? "";
}

export function cvColorMeta(id: CvColorId) {
  return cvColors.find((item) => item.id === id) ?? cvColors[3];
}

export const graduatePdfPages = [1, 2] as const;

export function graduatePreviewSrc(page: (typeof graduatePdfPages)[number], color: CvColorId) {
  return `/templates/international-resume_page_${page}_${color}.png`;
}

export function formatCvDesign(templateId?: string, colorId?: string) {
  const template = cvTemplateLabel(templateId);
  const color = cvColorLabel(colorId);
  if (!template && !color) return "";
  if (!color) return template;
  if (!template) return color;
  return `${template} · ${color}`;
}
