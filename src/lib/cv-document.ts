import type { Education, Employment, GeneratorDraft, Reference } from "@/lib/generator";

/** Spacing and type sizes taken from the Samuel Parirenyatwa Word/PDF template. */
export const cvLayout = {
  pageWidthMm: 210,
  pageHeightMm: 297,
  marginXMm: 15.5,
  marginYMm: 14,
  nameSizePt: 18,
  headlineSizePt: 12,
  contactSizePt: 10.5,
  headingSizePt: 12,
  bodySizePt: 11,
  lineHeight: 1.22,
};

export type ExperienceBlock = {
  companyLine: string;
  dates: string;
  title: string;
  intro?: string;
  bullets: string[];
};

export type CvDocumentModel = {
  fullName: string;
  headline: string;
  contact: string;
  languages: string;
  summary: string;
  education: string[];
  skills: string[];
  experience: ExperienceBlock[];
  affiliations: string[];
  development: string[];
  awards: string[];
  references: string[];
  showReferencesHeading: boolean;
};

function lines(value: string | undefined): string[] {
  return (value ?? "")
    .split(/\r?\n/)
    .map((item) => item.replace(/^[•\-\*▸]\s*/, "").trim())
    .filter(Boolean);
}

function csv(value: string | undefined): string[] {
  return (value ?? "")
    .split(/[,;\n|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function pipeLine(parts: Array<string | undefined>): string {
  return parts.map((part) => (part ?? "").trim()).filter(Boolean).join(" | ");
}

export function splitExperienceBody(text: string): { intro?: string; bullets: string[] } {
  const body = lines(text);
  if (body.length > 1 && /[;:]$/.test(body[0])) {
    return { intro: body[0], bullets: body.slice(1) };
  }
  return { bullets: body };
}

function formatEducation(item: Education): string {
  return pipeLine([item.qualification, item.institution, item.year]);
}

function formatReference(item: Reference): string {
  return pipeLine([item.name, item.relationship, item.contact]);
}

function mergeSkills(skills: string, keywords: string): string[] {
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const skill of [...csv(skills), ...csv(keywords)]) {
    const key = skill.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(skill);
  }
  return merged;
}

function formatExperience(item: Employment): ExperienceBlock {
  const companyLine = pipeLine([item.company, item.location]);
  const dates = [item.start, item.end].map((part) => part.trim()).filter(Boolean).join(" – ");
  const body = splitExperienceBody(item.bullets);
  return {
    companyLine: companyLine || item.title,
    dates,
    title: item.title.trim(),
    intro: body.intro,
    bullets: body.bullets,
  };
}

export function buildCvDocument(draft: GeneratorDraft): CvDocumentModel {
  const headline = (draft.headline || draft.targetRole).trim();
  const contact = pipeLine([draft.phone, draft.email, draft.city, draft.linkedin]);
  const awards = lines(draft.achievements);
  const affiliations = lines(draft.affiliations);
  const development = lines(draft.development);
  const education = draft.education.map(formatEducation).filter(Boolean);
  const experience = draft.employment
    .filter((item) => item.title.trim() || item.company.trim())
    .map(formatExperience);
  const namedRefs = draft.references.map(formatReference).filter(Boolean);
  const references =
    draft.includeReferences && namedRefs.length ? namedRefs : ["Available on Request"];

  return {
    fullName: draft.fullName.trim() || "Your Name",
    headline: headline || "Professional Title",
    contact: contact || "Phone | Email | City | LinkedIn",
    languages: draft.languages.trim(),
    summary: draft.summary.trim(),
    education,
    skills: mergeSkills(draft.skills, draft.keywords),
    experience,
    affiliations,
    development,
    awards,
    references,
    showReferencesHeading: true,
  };
}
