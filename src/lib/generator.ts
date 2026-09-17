export type Employment = {
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string;
};

export type Education = {
  qualification: string;
  institution: string;
  year: string;
};

export type Reference = {
  name: string;
  relationship: string;
  contact: string;
};

export type GeneratorDraft = {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  city: string;
  linkedin: string;
  languages: string;
  summary: string;
  employment: Employment[];
  achievements: string;
  affiliations: string;
  education: Education[];
  development: string;
  skills: string;
  targetRole: string;
  keywords: string;
  includeReferences: boolean;
  references: Reference[];
};

export const emptyEmployment = (): Employment => ({
  title: "",
  company: "",
  location: "",
  start: "",
  end: "",
  bullets: "",
});

export const emptyDraft = (): GeneratorDraft => ({
  fullName: "",
  headline: "",
  email: "",
  phone: "",
  city: "",
  linkedin: "",
  languages: "",
  summary: "",
  employment: [emptyEmployment()],
  achievements: "",
  affiliations: "",
  education: [{ qualification: "", institution: "", year: "" }],
  development: "",
  skills: "",
  targetRole: "",
  keywords: "",
  includeReferences: false,
  references: [{ name: "", relationship: "", contact: "" }],
});

export function hydrateDraft(value: unknown): GeneratorDraft {
  const base = emptyDraft();
  if (!value || typeof value !== "object") return base;
  const raw = value as Partial<GeneratorDraft>;
  return {
    ...base,
    ...raw,
    employment:
      Array.isArray(raw.employment) && raw.employment.length
        ? raw.employment.map((item) => ({ ...emptyEmployment(), ...item }))
        : base.employment,
    education:
      Array.isArray(raw.education) && raw.education.length
        ? raw.education.map((item) => ({ qualification: "", institution: "", year: "", ...item }))
        : base.education,
    references:
      Array.isArray(raw.references) && raw.references.length
        ? raw.references.map((item) => ({ name: "", relationship: "", contact: "", ...item }))
        : base.references,
    languages: raw.languages ?? "",
    affiliations: raw.affiliations ?? "",
    development: raw.development ?? "",
  };
}

export const steps = [
  "Personal",
  "Employment",
  "Achievements",
  "Education",
  "Skills",
  "ATS Readiness",
  "References",
] as const;

export const DRAFT_STORAGE_KEY = "creative-cv-generator-draft";
