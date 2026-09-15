export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  province: string;
  type: "Full-time" | "Contract" | "Part-time" | "Internship";
  industry: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryLabel: string;
  postedAt: string;
  featured?: boolean;
  description: string;
  requirements: string[];
};

export const industries = [
  "Finance",
  "Information Technology",
  "Healthcare",
  "Engineering",
  "Marketing",
  "Human Resources",
  "Education",
  "Retail",
  "Hospitality",
  "Legal",
  "Mining",
  "Logistics",
] as const;

export const provinces = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Remote",
] as const;

export const seedJobs: Job[] = [
  {
    id: "job-fin-001",
    title: "Financial Accountant",
    company: "Apex Ledger Partners",
    location: "Sandton, Johannesburg",
    province: "Gauteng",
    type: "Full-time",
    industry: "Finance",
    salaryMin: 450000,
    salaryMax: 620000,
    salaryLabel: "R450k – R620k",
    postedAt: "2026-09-10",
    featured: true,
    description:
      "Join a growing professional services firm supporting mid-market clients across Gauteng. You will own month-end, management packs, and audit preparation while working closely with a hands-on partnership team.",
    requirements: [
      "BCom Accounting or equivalent",
      "Completed articles or 3+ years in practice",
      "Strong Excel and reporting discipline",
      "SARS and IFRS familiarity",
    ],
  },
  {
    id: "job-it-002",
    title: "Full-Stack Software Engineer",
    company: "Nimbus Labs",
    location: "Cape Town CBD",
    province: "Western Cape",
    type: "Full-time",
    industry: "Information Technology",
    salaryMin: 650000,
    salaryMax: 900000,
    salaryLabel: "R650k – R900k",
    postedAt: "2026-09-12",
    featured: true,
    description:
      "Build product features for a South African SaaS platform used by recruiters and hiring managers. You will ship TypeScript services, React interfaces, and reliable APIs in a small, senior team.",
    requirements: [
      "4+ years professional software development",
      "TypeScript, React, and Node.js",
      "Experience with Postgres or similar",
      "Comfortable in a product-led environment",
    ],
  },
  {
    id: "job-hr-003",
    title: "Talent Acquisition Specialist",
    company: "Harbour & Co.",
    location: "Umhlanga",
    province: "KwaZulu-Natal",
    type: "Full-time",
    industry: "Human Resources",
    salaryMin: 380000,
    salaryMax: 520000,
    salaryLabel: "R380k – R520k",
    postedAt: "2026-09-08",
    description:
      "Own end-to-end recruitment for professional and technical roles. Source, screen, and partner with hiring managers while keeping candidates informed throughout the process.",
    requirements: [
      "2+ years recruitment or talent acquisition",
      "Excellent stakeholder communication",
      "Experience with an ATS",
      "Driver’s licence advantageous",
    ],
  },
  {
    id: "job-eng-004",
    title: "Civil Engineer — Infrastructure",
    company: "Khula Infrastructure",
    location: "Gqeberha",
    province: "Eastern Cape",
    type: "Full-time",
    industry: "Engineering",
    salaryMin: 520000,
    salaryMax: 740000,
    salaryLabel: "R520k – R740k",
    postedAt: "2026-09-05",
    description:
      "Deliver municipal and transport infrastructure projects from design through construction support. Site visits and consultant coordination are part of the weekly rhythm.",
    requirements: [
      "BEng / BSc Civil Engineering",
      "ECSA registration or in progress",
      "3+ years infrastructure project experience",
      "Willingness to travel within the Eastern Cape",
    ],
  },
  {
    id: "job-mkt-005",
    title: "Brand & Content Manager",
    company: "Sable Studio",
    location: "Remote (South Africa)",
    province: "Remote",
    type: "Full-time",
    industry: "Marketing",
    salaryMin: 420000,
    salaryMax: 580000,
    salaryLabel: "R420k – R580k",
    postedAt: "2026-09-11",
    featured: true,
    description:
      "Lead brand voice, campaigns, and content for a growing consumer brand. You will brief creatives, own the editorial calendar, and measure what actually moves the business.",
    requirements: [
      "5+ years brand or content experience",
      "Portfolio of campaigns or publications",
      "Comfortable with analytics and reporting",
      "Excellent written English",
    ],
  },
  {
    id: "job-hc-006",
    title: "Registered Nurse — Theatre",
    company: "Atlantic Care Group",
    location: "Durbanville, Cape Town",
    province: "Western Cape",
    type: "Full-time",
    industry: "Healthcare",
    salaryMin: 360000,
    salaryMax: 480000,
    salaryLabel: "R360k – R480k",
    postedAt: "2026-09-07",
    description:
      "Support a busy theatre unit in a private hospital setting. Shift work applies, with a team that values clinical excellence and calm under pressure.",
    requirements: [
      "SANC registered",
      "Theatre experience preferred",
      "Current BLS",
      "Ability to work rotational shifts",
    ],
  },
  {
    id: "job-edu-007",
    title: "FET Phase Mathematics Teacher",
    company: "Oakridge Independent",
    location: "Pretoria East",
    province: "Gauteng",
    type: "Full-time",
    industry: "Education",
    salaryMin: 320000,
    salaryMax: 430000,
    salaryLabel: "R320k – R430k",
    postedAt: "2026-09-03",
    description:
      "Teach FET Mathematics in a well-resourced independent school. You will contribute to extra-murals and a culture that takes academic care seriously.",
    requirements: [
      "PGCE or equivalent teaching qualification",
      "SACE registration",
      "Experience teaching Grades 10–12 Mathematics",
      "Willingness to participate in school life",
    ],
  },
  {
    id: "job-log-008",
    title: "Supply Chain Coordinator",
    company: "Coastal Freight",
    location: "Durban Port",
    province: "KwaZulu-Natal",
    type: "Full-time",
    industry: "Logistics",
    salaryMin: 300000,
    salaryMax: 420000,
    salaryLabel: "R300k – R420k",
    postedAt: "2026-09-09",
    description:
      "Coordinate inbound and outbound shipments, documentation, and exception handling for a regional freight operator serving retail and manufacturing clients.",
    requirements: [
      "Diploma or degree in logistics / supply chain",
      "2+ years freight or warehousing coordination",
      "Strong documentation accuracy",
      "Comfortable with TMS / Excel",
    ],
  },
  {
    id: "job-leg-009",
    title: "Candidate Attorney",
    company: "Moyo & Associates",
    location: "Rosebank, Johannesburg",
    province: "Gauteng",
    type: "Full-time",
    industry: "Legal",
    salaryMin: 240000,
    salaryMax: 320000,
    salaryLabel: "R240k – R320k",
    postedAt: "2026-09-06",
    description:
      "Serve articles in a boutique commercial practice. You will support litigation and transactional matters, with close mentorship from directors.",
    requirements: [
      "LLB",
      "Admission-ready or recently completed studies",
      "Excellent research and drafting",
      "Interest in commercial law",
    ],
  },
  {
    id: "job-min-010",
    title: "Mine Planning Engineer",
    company: "Thaba Resources",
    location: "Rustenburg",
    province: "North West",
    type: "Full-time",
    industry: "Mining",
    salaryMin: 700000,
    salaryMax: 980000,
    salaryLabel: "R700k – R980k",
    postedAt: "2026-09-04",
    featured: true,
    description:
      "Produce short- and medium-term mine plans for an established operation. Safety, production, and cost sit equally in this role.",
    requirements: [
      "BEng Mining or related",
      "Mine planning software experience",
      "5+ years underground or open-pit planning",
      "Valid medical and willingness to be site-based",
    ],
  },
  {
    id: "job-ret-011",
    title: "Store Manager",
    company: "Linen & Light",
    location: "Menlyn, Pretoria",
    province: "Gauteng",
    type: "Full-time",
    industry: "Retail",
    salaryMin: 280000,
    salaryMax: 380000,
    salaryLabel: "R280k – R380k",
    postedAt: "2026-09-13",
    description:
      "Lead a flagship homeware store: people, stock integrity, and a service culture that matches a premium brand.",
    requirements: [
      "3+ years retail management",
      "Proven people leadership",
      "Comfort with targets and reporting",
      "Availability for weekend trading",
    ],
  },
  {
    id: "job-hos-012",
    title: "Assistant Food & Beverage Manager",
    company: "The Constantia House",
    location: "Constantia, Cape Town",
    province: "Western Cape",
    type: "Full-time",
    industry: "Hospitality",
    salaryMin: 310000,
    salaryMax: 410000,
    salaryLabel: "R310k – R410k",
    postedAt: "2026-09-02",
    description:
      "Support F&B operations in a luxury guest house and restaurant. Service standards, rostering, and guest recovery are daily work.",
    requirements: [
      "Hospitality diploma or equivalent experience",
      "Supervisory F&B experience",
      "Wine knowledge advantageous",
      "Flexibility for service hours",
    ],
  },
  {
    id: "job-it-013",
    title: "IT Support Technician (Contract)",
    company: "Municipal Digital Office",
    location: "Bloemfontein",
    province: "Free State",
    type: "Contract",
    industry: "Information Technology",
    salaryMin: 22000,
    salaryMax: 28000,
    salaryLabel: "R22k – R28k per month",
    postedAt: "2026-09-01",
    description:
      "12-month contract supporting end users, hardware rollout, and ticket resolution for a public-sector digital programme.",
    requirements: [
      "A+ / N+ or equivalent practical experience",
      "Windows and Microsoft 365 support",
      "Clear communication with non-technical users",
      "SA citizenship or valid work status",
    ],
  },
  {
    id: "job-fin-014",
    title: "Credit Analyst",
    company: "Savanna Bank",
    location: "Centurion",
    province: "Gauteng",
    type: "Full-time",
    industry: "Finance",
    salaryMin: 480000,
    salaryMax: 640000,
    salaryLabel: "R480k – R640k",
    postedAt: "2026-08-29",
    description:
      "Assess commercial credit applications, prepare recommendation papers, and monitor a portfolio of mid-market clients.",
    requirements: [
      "BCom Finance / Economics",
      "Credit or lending experience",
      "Strong numerical analysis",
      "NCA awareness",
    ],
  },
  {
    id: "job-mkt-015",
    title: "Digital Marketing Intern",
    company: "Plain Sight Media",
    location: "Stellenbosch",
    province: "Western Cape",
    type: "Internship",
    industry: "Marketing",
    salaryMin: 8000,
    salaryMax: 12000,
    salaryLabel: "R8k – R12k per month stipend",
    postedAt: "2026-09-14",
    description:
      "A structured 12-month internship covering paid media, analytics, and content operations. Ideal for a graduate ready to learn in a live agency environment.",
    requirements: [
      "Marketing, communications, or related qualification",
      "Curiosity about digital channels",
      "Portfolio of student or freelance work helpful",
      "Based in or able to commute to Stellenbosch",
    ],
  },
  {
    id: "job-hc-016",
    title: "Occupational Health Practitioner",
    company: "Highveld Clinics",
    location: "Witbank / Emalahleni",
    province: "Mpumalanga",
    type: "Full-time",
    industry: "Healthcare",
    salaryMin: 420000,
    salaryMax: 560000,
    salaryLabel: "R420k – R560k",
    postedAt: "2026-08-31",
    description:
      "Run occupational health surveillance and fitness-for-work assessments for industrial clients. Travel between sites is expected.",
    requirements: [
      "BTech / BCur Occupational Health",
      "SASOHN membership advantageous",
      "Occupational health clinic experience",
      "Valid driver’s licence",
    ],
  },
];

export function filterJobs(
  jobs: Job[],
  query: {
    q?: string;
    industry?: string;
    location?: string;
    type?: string;
  },
) {
  const q = query.q?.trim().toLowerCase();
  return jobs.filter((job) => {
    if (q) {
      const haystack = `${job.title} ${job.company} ${job.location} ${job.industry} ${job.description}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (query.industry && job.industry !== query.industry) return false;
    if (query.location && job.province !== query.location) return false;
    if (query.type && job.type !== query.type) return false;
    return true;
  });
}
