export type TermsSection = {
  id: string;
  heading: string;
  body: string;
};

export type TermsContent = {
  title: string;
  lastUpdated: string;
  sections: TermsSection[];
};

export type TermsBlock =
  | { type: "p"; text: string; variant: "normal" | "accent" | "label" }
  | { type: "ul"; items: string[] };

export const TERMS_EYEBROW = "Legal";

export const defaultTerms: TermsContent = {
  title: "Terms and Conditions",
  lastUpdated: "November 13, 2024",
  sections: [
    {
      id: "introduction",
      heading: "1. Introduction",
      body: "Welcome to Creative CV. These Terms and Conditions govern your use of our website and services. By accessing or using our services, you agree to be bound by these terms.",
    },
    {
      id: "services",
      heading: "2. Services",
      body: `Creative CV provides professional CV writing, cover letter writing, and LinkedIn profile optimization services. Our services include:

- Custom CV writing from scratch
- Cover letter creation
- LinkedIn profile optimization
- Individual or bundled packages
- 24/7 customer support

If you're not interested in a bundle and prefer just a CV or LinkedIn profile writing service, we always accommodate our clients' needs and are happy to help you with individual service options.`,
    },
    {
      id: "linkedin",
      heading: "3. LinkedIn Optimization Service",
      body: `Our LinkedIn Optimization service is designed to enhance your LinkedIn profile, making it more attractive to recruiters, potential clients, and collaborators. We strategically craft your profile to improve visibility, engagement, add more connections, and we upload your CV and tag the team of recruiters we work with to increase your chances of success and overall impact.

**Important:** If you prefer that we don't upload your CV to LinkedIn, please let us know. However, please note that this may limit your exposure to the recruiters we work with.`,
    },
    {
      id: "payment",
      heading: "4. Payment Terms",
      body: `Payment is required before work begins on your order. We accept payment via PayFast and all major credit/debit cards. All prices are in South African Rand (ZAR) unless otherwise stated.

= Day Counting:

Counting starts the day after payment reflects in our account.`,
    },
    {
      id: "turnaround",
      heading: "5. Turnaround Times",
      body: `- 1st Draft Turnaround Time: 4-10 working days, depending on your package
- Final CV Turnaround Time: 2 working days post CV content approval`,
    },
    {
      id: "revisions",
      heading: "6. Revision Policy",
      body: `Your CV will be delivered in both PDF and Word formats. You may make minor edits yourself if you wish. For major updates, or if you prefer us to make the changes for you, simply email your revisions to {email}, including your order number in the subject line.

**Important:** If you do not respond within 3 days of receiving your CV, your order will be closed. Once you approve your CV, the order will also be closed.

!!To reopen a closed order, a R550 reopening fee will apply.!!`,
    },
    {
      id: "recruiters",
      heading: "7. Recruiter Database & Review Process",
      body: `When we provide you with a thank-you note, it includes a unique code that we use to add your CV to our recruiters' database. If you choose to pass without reviewing your CV, we will not be able to add it to the database. In such cases, you become a "pass-by client," which may affect the process and cost when you return for future edits.`,
    },
    {
      id: "refunds",
      heading: "8. Refund Policy",
      body: `!!Refunds can only be requested within 2 days of payment.!!

After this period, no refunds will be issued as work on your service will have already commenced. We are committed to your satisfaction and will continue working on your documents until you are satisfied with the results.`,
    },
    {
      id: "references",
      heading: "9. References Policy",
      body: `You should avoid including references on your CV, as most Applicant Tracking Systems (ATS) cannot read them. This may reduce your chances of passing the initial screening stage.

However, if you still prefer to have references included, we can add them upon request. Please note that in such cases, we cannot be held responsible if your application is rejected due to ATS incompatibility.`,
    },
    {
      id: "privacy",
      heading: "10. Data Security & Privacy",
      body: "We take data security seriously. All information you share is encrypted and stored securely. We never share your personal information with third parties, and you can request deletion of your data at any time.",
    },
    {
      id: "ip",
      heading: "11. Intellectual Property",
      body: "Once payment is received and your documents are completed, you own the rights to your CV, cover letter, and LinkedIn profile. We retain the right to use anonymized examples for marketing purposes.",
    },
    {
      id: "liability",
      heading: "12. Limitation of Liability",
      body: "While we strive to provide the highest quality service, we cannot guarantee employment outcomes. Creative CV is not responsible for hiring decisions made by employers or recruiters.",
    },
    {
      id: "contact",
      heading: "13. Contact",
      body: `If you have any questions about these Terms & Conditions, please contact us at {email} or call us at {phone}

**Opening Hours:** Monday - Thursday: 8:00 AM - 4:00 PM | Friday: 8:00 AM - 1:00 PM`,
    },
  ],
};

export function formatTermsDate(date = new Date()) {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function normalizeTerms(input: unknown, fallback: TermsContent = defaultTerms): TermsContent {
  if (!input || typeof input !== "object") return fallback;
  const raw = input as Partial<TermsContent>;
  const title = typeof raw.title === "string" && raw.title.trim() ? raw.title.trim() : fallback.title;
  const lastUpdated =
    typeof raw.lastUpdated === "string" && raw.lastUpdated.trim() ? raw.lastUpdated.trim() : fallback.lastUpdated;
  const sections = Array.isArray(raw.sections)
    ? raw.sections.flatMap((section, index) => {
        if (!section || typeof section !== "object") return [];
        const item = section as Partial<TermsSection>;
        const heading = typeof item.heading === "string" ? item.heading.trim() : "";
        const body = typeof item.body === "string" ? item.body.trim() : "";
        if (!heading && !body) return [];
        return [
          {
            id: typeof item.id === "string" && item.id.trim() ? item.id.trim() : `section-${index + 1}`,
            heading: heading || `Section ${index + 1}`,
            body,
          },
        ];
      })
    : [];
  if (!sections.length) return { title, lastUpdated, sections: fallback.sections };
  return { title, lastUpdated, sections };
}

export function parseTermsBody(body: string): TermsBlock[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: TermsBlock[] = [];
  let list: string[] | null = null;
  let para: string[] = [];

  function flushList() {
    if (list?.length) blocks.push({ type: "ul", items: list });
    list = null;
  }

  function flushPara() {
    const raw = para.join(" ").trim();
    para = [];
    if (!raw) return;
    if (raw.startsWith("!!") && raw.endsWith("!!") && raw.length > 4) {
      blocks.push({ type: "p", text: raw.slice(2, -2).trim(), variant: "accent" });
      return;
    }
    if (raw.startsWith("= ")) {
      blocks.push({ type: "p", text: raw.slice(2).trim(), variant: "label" });
      return;
    }
    blocks.push({ type: "p", text: raw, variant: "normal" });
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ")) {
      flushPara();
      list = list ?? [];
      list.push(trimmed.slice(2).trim());
      continue;
    }
    if (!trimmed) {
      flushList();
      flushPara();
      continue;
    }
    flushList();
    para.push(trimmed);
  }
  flushList();
  flushPara();
  return blocks;
}
