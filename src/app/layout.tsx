import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { HideOnAdmin } from "@/components/layout/hide-on-admin";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { site } from "@/lib/site";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Professional CV Writing Services in South Africa`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: `${site.name} — Professional CV Writing Services in South Africa`,
    description: site.description,
    type: "website",
    locale: "en_ZA",
    siteName: site.name,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={`${sourceSans.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        <HideOnAdmin>
          <Header />
        </HideOnAdmin>
        <main>{children}</main>
        <HideOnAdmin>
          <Footer />
          <WhatsAppButton />
        </HideOnAdmin>
      </body>
    </html>
  );
}
