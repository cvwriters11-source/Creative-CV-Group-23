export const site = {
  name: "Creative CV",
  legalName: "Creative CV",
  tagline: "Elevate Your Career with Confidence!",
  description:
    "Stand out from the crowd and connect with top recruiters today! We are experienced professionals who care about your success. Let us help you gain and master your career success.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "info@creative-cv.co.za",
  phone: "+27 74 650 2580",
  phoneHref: "tel:+27746502580",
  hours: "Mon–Thu 8:00am–4:00pm · Fri 8:00am–1:00pm",
  hoursShort: "Mon–Thu 8–4, Fri 8–1",
  location: "South Africa",
  founded: 2017,
  founder: "Samuel T. Parirenyatwa",
  rating: "5.0/5",
  googleRating: "4.9/5",
  trustpilot: "4.7",
  whatsappHref: "https://wa.me/27746502580?text=Hi%20Creative%20CV%2C%20I%20would%20like%20to%20enquire%20about%20your%20services.",
  cvGeneratorHref: "/cv-generator",
} as const;

export const nav = [
  { href: "/jobs", label: "Find Jobs" },
  { href: "/cv-generator", label: "ATS Tester" },
  { href: "/packages", label: "CV Packages" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
