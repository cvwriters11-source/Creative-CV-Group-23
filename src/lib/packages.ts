export type PackageId =
  | "fresh-graduate"
  | "professional"
  | "executive"
  | "international"
  | "cv-only"
  | "return-standard"
  | "return-express";

export type AddonId =
  | "career-coaching"
  | "linkedin"
  | "interview-coaching"
  | "career-transitioning"
  | "cover-letter"
  | "salary-negotiation";

export type CatalogPackage = {
  id: PackageId;
  name: string;
  price: number;
  turnaroundDays: number;
  turnaroundLabel: string;
  audience: string;
  summary: string;
  included: string[];
  popular?: boolean;
  category: "core" | "standalone" | "return";
};

export type CatalogAddon = {
  id: AddonId;
  name: string;
  price: number;
  href?: string;
  description: string;
};

export const packages: CatalogPackage[] = [
  {
    id: "fresh-graduate",
    name: "Fresh Graduate CV",
    price: 950,
    turnaroundDays: 10,
    turnaroundLabel: "10 working days",
    audience: "New graduates and first-job applicants who need a strong first impression.",
    summary:
      "A professionally written CV that turns academic work, internships, and campus experience into a recruiter-ready story.",
    included: [
      "Professionally written graduate CV",
      "ATS-friendly formatting and keywords",
      "Word + PDF delivery",
      "Free tailored job alerts after purchase",
      "Revisions until you are satisfied",
    ],
    category: "core",
  },
  {
    id: "professional",
    name: "Professional CV",
    price: 1200,
    turnaroundDays: 7,
    turnaroundLabel: "7 working days",
    audience: "Working professionals ready to move roles, industries, or seniority.",
    summary:
      "Our most requested package. A specialist writer positions your experience for the next rung on your career ladder.",
    included: [
      "Custom professional CV (no templates)",
      "Industry-specific ATS optimisation",
      "Word + PDF delivery",
      "Free tailored job alerts",
      "Direct writer contact and 100% satisfaction guarantee",
    ],
    popular: true,
    category: "core",
  },
  {
    id: "executive",
    name: "Executive CV",
    price: 1500,
    turnaroundDays: 5,
    turnaroundLabel: "5 working days",
    audience: "Senior managers and executives who need board-level presence.",
    summary:
      "Leadership narrative, commercial impact, and a document that holds up in executive search and board processes.",
    included: [
      "Executive-level CV written from scratch",
      "Achievement and leadership positioning",
      "Faster 5-day turnaround",
      "Word + PDF delivery",
      "Free tailored job alerts",
    ],
    category: "core",
  },
  {
    id: "international",
    name: "International Résumé",
    price: 3000,
    turnaroundDays: 4,
    turnaroundLabel: "4 working days",
    audience: "Candidates targeting roles outside South Africa or with global employers.",
    summary:
      "An internationally formatted résumé aligned to overseas hiring norms, with guidance for global applications.",
    included: [
      "International résumé format",
      "Market-specific positioning",
      "4 working day turnaround",
      "Word + PDF delivery",
      "International job application guidance",
    ],
    category: "core",
  },
  {
    id: "cv-only",
    name: "CV Only",
    price: 750,
    turnaroundDays: 10,
    turnaroundLabel: "Up to 10 working days",
    audience: "Anyone who wants expert writing without a bundle.",
    summary:
      "If you don’t want a bundle, we always accommodate individual service options. Professional CV writing on its own.",
    included: [
      "Professionally written CV",
      "ATS-friendly formatting",
      "Word + PDF delivery",
      "Satisfaction guarantee",
    ],
    category: "standalone",
  },
  {
    id: "return-standard",
    name: "Return Client — Standard Edit",
    price: 750,
    turnaroundDays: 7,
    turnaroundLabel: "7 working days",
    audience: "Returning clients who need a standard update to an existing Creative CV.",
    summary:
      "A considered edit of your existing Creative CV for a new role, promotion, or refreshed positioning.",
    included: [
      "Standard edit of your existing CV",
      "Updated targeting and keywords",
      "Word + PDF delivery",
    ],
    category: "return",
  },
  {
    id: "return-express",
    name: "Return Client — Express Edit",
    price: 1000,
    turnaroundDays: 3,
    turnaroundLabel: "Express turnaround",
    audience: "Returning clients who need a faster refresh.",
    summary:
      "Priority editing when you need an updated CV back quickly — subject to writer availability.",
    included: [
      "Express edit of your existing CV",
      "Priority writer scheduling",
      "Word + PDF delivery",
    ],
    category: "return",
  },
];

export const addons: CatalogAddon[] = [
  {
    id: "career-coaching",
    name: "Career Coaching",
    price: 550,
    href: "/services/career-coaching",
    description: "Clarity, a career roadmap, and a focused search strategy.",
  },
  {
    id: "linkedin",
    name: "LinkedIn Profile Optimisation",
    price: 550,
    description: "A recruiter-ready LinkedIn profile that improves visibility and engagement.",
  },
  {
    id: "interview-coaching",
    name: "Interview Coaching",
    price: 650,
    href: "/services/interview-coaching",
    description: "Mock interviews, STAR frameworks, and confident delivery.",
  },
  {
    id: "career-transitioning",
    name: "Career Transitioning",
    price: 500,
    href: "/services/career-transitioning",
    description: "Reposition transferable skills for a new role or industry.",
  },
  {
    id: "cover-letter",
    name: "Cover Letter",
    price: 550,
    description: "A tailored cover letter that supports your CV for target roles.",
  },
  {
    id: "salary-negotiation",
    name: "Salary Negotiation",
    price: 350,
    href: "/services/salary-negotiation",
    description: "Market data, scripts, and coaching to advocate for your worth.",
  },
];

export const generatorPrice = 350;

export function getPackage(id: string) {
  return packages.find((item) => item.id === id);
}

export function getAddon(id: string) {
  return addons.find((item) => item.id === id);
}
