import { PageIntro } from "@/components/ui/primitives";

export default function PrivacyPage() {
  return (
    <article className="bg-paper">
      <div className="mx-auto max-w-3xl px-5 py-16 leading-relaxed text-ink-soft lg:px-8">
      <PageIntro eyebrow="Legal" title="Privacy Policy" />
      <p className="mt-8 text-sm">Last updated: November 13, 2024</p>
      <div className="prose-editorial mt-10 space-y-8">
        <section>
          <h2 className="heading-accent text-2xl text-ink">1. Introduction</h2>
          <p className="mt-3">
            At Creative CV, we take your privacy seriously. This Privacy Policy explains how we collect, use, protect,
            and share your personal information when you use our services.
          </p>
        </section>
        <section>
          <h2 className="heading-accent text-2xl text-ink">2. Information We Collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Personal Information: Name, email address, phone number, and other contact details</li>
            <li>Professional Information: Work history, education, skills, achievements, and career goals</li>
            <li>Payment Information: Processed securely through Paystack; we do not store credit card details</li>
            <li>Usage Data: Information about how you interact with our website</li>
          </ul>
        </section>
        <section>
          <h2 className="heading-accent text-2xl text-ink">3. How We Use Your Information</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Provide and improve our CV writing services</li>
            <li>Communicate with you about your order</li>
            <li>Process payments</li>
            <li>Send you job alerts (if opted in)</li>
            <li>Provide customer support</li>
            <li>Send marketing communications (with your consent)</li>
          </ul>
        </section>
        <section>
          <h2 className="heading-accent text-2xl text-ink">4. Data Security</h2>
          <p className="mt-3">
            We implement industry-standard security measures to protect your personal information. All data is encrypted
            in transit and at rest. We use secure servers and regularly update our security protocols.
          </p>
        </section>
        <section>
          <h2 className="heading-accent text-2xl text-ink">5. Data Sharing</h2>
          <p className="mt-3">We do not sell your personal information. We may share your information with:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Service Providers: such as payment processors (Paystack) and email service providers</li>
            <li>Legal Requirements: If required by law or to protect our rights</li>
          </ul>
        </section>
        <section>
          <h2 className="heading-accent text-2xl text-ink">6. Your Rights</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Access your personal information</li>
            <li>Request corrections to your data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>
        <section>
          <h2 className="heading-accent text-2xl text-ink">7. Cookies</h2>
          <p className="mt-3">
            We use cookies to improve your experience on our website. You can control cookie settings in your browser.
          </p>
        </section>
        <section>
          <h2 className="heading-accent text-2xl text-ink">8. Data Retention</h2>
          <p className="mt-3">
            We retain your personal information for as long as necessary to provide our services and fulfill our legal
            obligations. You can request deletion of your data at any time.
          </p>
        </section>
        <section>
          <h2 className="heading-accent text-2xl text-ink">9. Changes to This Policy</h2>
          <p className="mt-3">
            We may update this Privacy Policy from time to time. We will notify you of any significant changes by email
            or through our website.
          </p>
        </section>
        <section>
          <h2 className="heading-accent text-2xl text-ink">10. Contact Us</h2>
          <p className="mt-3">
            If you have any questions about this Privacy Policy or how we handle your data, please contact us at
             info@creative-cv.co.za
          </p>
        </section>
      </div>
      </div>
    </article>
  );
}
