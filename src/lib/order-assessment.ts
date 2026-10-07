export const careerStages = [
  { value: "graduate", label: "Graduate / first professional role" },
  { value: "professional", label: "Established professional" },
  { value: "executive", label: "Senior / executive" },
  { value: "international", label: "Targeting work outside South Africa" },
  { value: "career-change", label: "Changing careers or industries" },
  { value: "returning", label: "Returning to work" },
] as const;

export type ExtraPosition = {
  company: string;
  startYear: string;
  endYear: string;
  current: boolean;
};

export type ExtraQualification = {
  institute: string;
  startDate: string;
  endDate: string;
  certificate: string;
};

export type CareerAssessmentAnswers = {
  currentRole: string;
  careerStage: string;
  targetRole: string;
  industry: string;
  careerTargets: string;
  referredBy: string;
  extraInfo: "yes" | "no" | "";
  achievements: string;
  memberships: string;
  skills: string[];
  technicalSkills: string[];
  hasLinkedin: "yes" | "no" | "";
  linkedinUrl: string;
  positions: ExtraPosition[];
  qualifications: ExtraQualification[];
};

function readList(data: FormData, prefix: string, count: number) {
  return Array.from({ length: count }, (_, index) => String(data.get(`${prefix}${index + 1}`) ?? "").trim()).filter(Boolean);
}

function readPositions(data: FormData): ExtraPosition[] {
  const companies = data.getAll("positionCompany").map((item) => String(item).trim());
  const starts = data.getAll("positionStartYear").map((item) => String(item).trim());
  const ends = data.getAll("positionEndYear").map((item) => String(item).trim());
  const currents = data.getAll("positionCurrent").map((item) => String(item) === "yes");
  return companies
    .map((company, index) => ({
      company,
      startYear: starts[index] ?? "",
      endYear: currents[index] ? "Current" : (ends[index] ?? ""),
      current: Boolean(currents[index]),
    }))
    .filter((item) => item.company || item.startYear || item.endYear);
}

function readQualifications(data: FormData): ExtraQualification[] {
  const institutes = data.getAll("qualInstitute").map((item) => String(item).trim());
  const starts = data.getAll("qualStartDate").map((item) => String(item).trim());
  const ends = data.getAll("qualEndDate").map((item) => String(item).trim());
  const certificates = data.getAll("qualCertificate").map((item) => String(item).trim());
  return institutes
    .map((institute, index) => ({
      institute,
      startDate: starts[index] ?? "",
      endDate: ends[index] ?? "",
      certificate: certificates[index] ?? "",
    }))
    .filter((item) => item.institute || item.certificate || item.startDate || item.endDate);
}

export function readCareerAssessment(data: FormData): CareerAssessmentAnswers {
  const extraInfo = String(data.get("extraInfo") ?? "").trim() === "yes" ? "yes" : "no";
  const hasLinkedin = String(data.get("hasLinkedin") ?? "").trim() === "yes" ? "yes" : "no";
  return {
    currentRole: String(data.get("currentRole") ?? "").trim(),
    careerStage: String(data.get("careerStage") ?? "").trim(),
    targetRole: String(data.get("targetRole") ?? "").trim(),
    industry: String(data.get("industry") ?? "").trim(),
    careerTargets: String(data.get("careerTargets") ?? "").trim(),
    referredBy: String(data.get("referredBy") ?? "").trim(),
    extraInfo,
    achievements: extraInfo === "yes" ? String(data.get("achievements") ?? "").trim() : "",
    memberships: extraInfo === "yes" ? String(data.get("memberships") ?? "").trim() : "",
    skills: extraInfo === "yes" ? readList(data, "skill", 5) : [],
    technicalSkills: extraInfo === "yes" ? readList(data, "techSkill", 7) : [],
    hasLinkedin: extraInfo === "yes" ? hasLinkedin : "",
    linkedinUrl: extraInfo === "yes" && hasLinkedin === "yes" ? String(data.get("linkedinUrl") ?? "").trim() : "",
    positions: extraInfo === "yes" ? readPositions(data) : [],
    qualifications: extraInfo === "yes" ? readQualifications(data) : [],
  };
}

function formatPosition(item: ExtraPosition) {
  const dates = item.current || item.endYear === "Current" ? `${item.startYear || "—"} – Current` : `${item.startYear || "—"} – ${item.endYear || "—"}`;
  return `${item.company} (${dates})`;
}

function formatQualification(item: ExtraQualification) {
  const dates = [item.startDate, item.endDate].filter(Boolean).join(" – ");
  return [item.certificate, item.institute, dates].filter(Boolean).join(" · ");
}

export function formatCareerAssessment(answers: CareerAssessmentAnswers) {
  const stage = careerStages.find((item) => item.value === answers.careerStage)?.label ?? answers.careerStage;
  const lines = [
    `Current role: ${answers.currentRole}`,
    `Career stage: ${stage}`,
    `Target role: ${answers.targetRole}`,
    `Industry: ${answers.industry}`,
    `Career targets: ${answers.careerTargets}`,
    `Referred by: ${answers.referredBy || "Not given"}`,
    `Extra information not on CV: ${answers.extraInfo === "yes" ? "Yes" : "No"}`,
  ];

  if (answers.extraInfo !== "yes") return lines.join("\n");

  if (answers.achievements) lines.push(`Achievements: ${answers.achievements}`);
  if (answers.memberships) lines.push(`Memberships: ${answers.memberships}`);
  if (answers.skills.length) lines.push(`Top skills: ${answers.skills.join(", ")}`);
  if (answers.technicalSkills.length) lines.push(`Technical skills: ${answers.technicalSkills.join(", ")}`);
  if (answers.hasLinkedin === "yes" && answers.linkedinUrl) lines.push(`LinkedIn: ${answers.linkedinUrl}`);
  else if (answers.hasLinkedin === "no") lines.push("LinkedIn: No");
  if (answers.positions.length) {
    lines.push("Positions to add:");
    answers.positions.forEach((item) => lines.push(`- ${formatPosition(item)}`));
  }
  if (answers.qualifications.length) {
    lines.push("Qualifications to add:");
    answers.qualifications.forEach((item) => lines.push(`- ${formatQualification(item)}`));
  }

  return lines.join("\n");
}

export function emptyPosition(): ExtraPosition {
  return { company: "", startYear: "", endYear: "", current: false };
}

export function emptyQualification(): ExtraQualification {
  return { institute: "", startDate: "", endDate: "", certificate: "" };
}
