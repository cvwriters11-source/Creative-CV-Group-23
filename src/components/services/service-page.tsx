import { ButtonLink, PageIntro } from "@/components/ui/primitives";
import { formatZar } from "@/lib/cn";
import { addons } from "@/lib/packages";

type Service = {
  slug: string;
  addonId: (typeof addons)[number]["id"];
  title: string;
  lede: string;
  sectionTitle: string;
  points: string[];
  included: string[];
};

export const services: Service[] = [
  {
    slug: "interview-coaching",
    addonId: "interview-coaching",
    title: "Interview Coaching",
    lede: "Our tailored interview coaching helps you stand out, feel confident, and secure the job you deserve. We equip you with the skills, strategies, and mindset to excel in any interview setting.",
    sectionTitle: "What you’ll gain",
    points: [
      "Tailored coaching for your target role and industry",
      "Mock interviews with actionable feedback",
      "Answer frameworks (e.g. STAR) and story crafting",
      "Confidence building, body language, and delivery",
      "Handling behavioural, technical and curveball questions",
      "Follow-up and post-interview best practices",
    ],
    included: [
      "1:1 coaching session(s)",
      "Mock interview + feedback report",
      "Personalised preparation checklist",
      "Question bank & answer templates",
    ],
  },
  {
    slug: "salary-negotiation",
    addonId: "salary-negotiation",
    title: "Salary Negotiation",
    lede: "Comprehensive negotiation preparation with proven strategies, personalised coaching, and practical tools to confidently advocate for your worth and secure the best possible offer.",
    sectionTitle: "What we cover",
    points: [
      "Market research and benchmarking for your role and level",
      "Value articulation: impact, achievements, and unique strengths",
      "Negotiation frameworks and timing strategies",
      "Role-play scenarios to handle objections and counter-offers",
      "Offer review: total compensation, benefits, and trade-offs",
      "Email and call scripts for each stage of the process",
    ],
    included: [
      "1:1 negotiation coaching session",
      "Custom compensation research brief",
      "Negotiation playbook & scripts",
      "Follow-up support (limited time)",
    ],
  },
  {
    slug: "career-coaching",
    addonId: "career-coaching",
    title: "Career Coaching",
    lede: "Comprehensive career coaching designed to empower you with the clarity, confidence, and strategies to navigate today's competitive job market and achieve your goals.",
    sectionTitle: "How we help",
    points: [
      "Goal setting and career roadmap",
      "CV and cover letter refinement for target roles",
      "LinkedIn branding and profile optimisation",
      "Interview coaching and preparation",
      "Job search strategy, outreach, and application tactics",
      "Accountability and momentum through structured milestones",
    ],
    included: [
      "1:1 strategy session",
      "Personal brand & LinkedIn guidance",
      "Action plan with clear next steps",
      "Targeted CV/cover letter feedback",
    ],
  },
  {
    slug: "career-transitioning",
    addonId: "career-transitioning",
    title: "Career Transitioning",
    lede: "Structured guidance to help you navigate your next professional chapter with clarity and confidence—mapping strengths to new opportunities and executing a focused transition plan.",
    sectionTitle: "What we do together",
    points: [
      "Personalised assessments to clarify direction and strengths",
      "Transferable skills mapping to target roles",
      "CV and cover letter tailored for new paths",
      "Networking strategy and outreach cadence",
      "Interview storytelling to bridge your transition",
      "90-day action plan to maintain momentum",
    ],
    included: [
      "1:1 transition strategy session",
      "Transferable skills & target role mapping",
      "Targeted CV/cover letter feedback",
      "Transition interview prep toolkit",
    ],
  },
];

export function ServicePage({ slug }: { slug: string }) {
  const service = services.find((item) => item.slug === slug);
  if (!service) return null;
  const price = addons.find((item) => item.id === service.addonId)?.price ?? 0;

  return (
    <div className="bg-wash">
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <PageIntro eyebrow="Career services" title={service.title} lede={service.lede} />
      <p className="mt-6 font-serif text-3xl text-accent">{formatZar(price)}</p>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <section>
          <h2 className="heading-accent font-serif text-3xl">{service.sectionTitle}</h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            We focus on practical, high-impact preparation that leaves you ready for both structured and conversational
            settings.
          </p>
          <ul className="mt-6 space-y-3 text-ink-soft">
            {service.points.map((point) => (
              <li key={point}>— {point}</li>
            ))}
          </ul>
        </section>
        <aside className="card-surface h-fit bg-gold-soft p-6">
          <h3 className="font-serif text-2xl">Included</h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            {service.included.map((item) => (
              <li key={item}>— {item}</li>
            ))}
          </ul>
          <ButtonLink href={`/packages?addon=${service.addonId}`} variant="accent" className="mt-6 w-full">
            Add to an order
          </ButtonLink>
        </aside>
      </div>
    </div>
    </div>
  );
}
