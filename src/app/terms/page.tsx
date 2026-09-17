import { PageIntro } from "@/components/ui/primitives";
import { site } from "@/lib/site";

export default function TermsPage() {
  return (
    <article className="bg-paper">
      <div className="mx-auto max-w-3xl px-5 py-16 leading-relaxed text-ink-soft lg:px-8">
        <PageIntro eyebrow="Legal" title="Terms and Conditions" />
        <p className="mt-8 text-sm">Last updated: November 13, 2024</p>
        <div className="mt-10 space-y-8">
          <section>
            <h2 className="heading-accent font-serif text-2xl text-ink">1. Introduction</h2>
            <p className="mt-3">
              Welcome to Creative CV. These Terms and Conditions govern your use of our website and services. By
              accessing or using our services, you agree to be bound by these terms.
            </p>
          </section>
          <section>
            <h2 className="heading-accent font-serif text-2xl text-ink">2. Services</h2>
            <p className="mt-3">
              Creative CV provides professional CV writing, cover letter writing, and LinkedIn profile optimization
              services. Our services include:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Custom CV writing from scratch</li>
              <li>Cover letter creation</li>
              <li>LinkedIn profile optimization</li>
              <li>Individual or bundled packages</li>
              <li>24/7 customer support</li>
            </ul>
            <p className="mt-3">
              If you&apos;re not interested in a bundle and prefer just a CV or LinkedIn profile writing service, we always
              accommodate our clients&apos; needs and are happy to help you with individual service options.
            </p>
          </section>
          <section>
            <h2 className="heading-accent font-serif text-2xl text-ink">3. LinkedIn Optimization Service</h2>
            <p className="mt-3">
              Our LinkedIn Optimization service is designed to enhance your LinkedIn profile, making it more attractive
              to recruiters, potential clients, and collaborators. We strategically craft your profile to improve
              visibility, engagement, add more connections, and we upload your CV and tag the team of recruiters we work
              with to increase your chances of success and overall impact.
            </p>
            <p className="mt-3">
              <strong>Important:</strong> If you prefer that we don&apos;t upload your CV to LinkedIn, please let us know.
              However, please note that this may limit your exposure to the recruiters we work with.
            </p>
          </section>
          <section>
            <h2 className="heading-accent font-serif text-2xl text-ink">4. Payment Terms</h2>
            <p className="mt-3">
              Payment is required before work begins on your order. We accept payment via PayFast and all major
              credit/debit cards. All prices are in South African Rand (ZAR) unless otherwise stated.
            </p>
            <p className="mt-3 font-semibold text-ink">Day Counting:</p>
            <p className="mt-3">Counting starts the day after payment reflects in our account.</p>
          </section>
          <section>
            <h2 className="heading-accent font-serif text-2xl text-ink">5. Turnaround Times</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>1st Draft Turnaround Time: 4-10 working days, depending on your package</li>
              <li>Final CV Turnaround Time: 2 working days post CV content approval</li>
            </ul>
          </section>
          <section>
            <h2 className="heading-accent font-serif text-2xl text-ink">6. Revision Policy</h2>
            <p className="mt-3">
              Your CV will be delivered in both PDF and Word formats. You may make minor edits yourself if you wish. For
              major updates, or if you prefer us to make the changes for you, simply email your revisions to{" "}
              <a className="content-link" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              , including your order number in the subject line.
            </p>
            <p className="mt-3">
              <strong>Important:</strong> If you do not respond within 3 days of receiving your CV, your order will be
              closed. Once you approve your CV, the order will also be closed.
            </p>
            <p className="mt-3 font-semibold text-accent">
              To reopen a closed order, a R550 reopening fee will apply.
            </p>
          </section>
          <section>
            <h2 className="heading-accent font-serif text-2xl text-ink">7. Recruiter Database & Review Process</h2>
            <p className="mt-3">
              When we provide you with a thank-you note, it includes a unique code that we use to add your CV to our
              recruiters&apos; database. If you choose to pass without reviewing your CV, we will not be able to add it to
              the database. In such cases, you become a &quot;pass-by client,&quot; which may affect the process and cost
              when you return for future edits.
            </p>
          </section>
          <section>
            <h2 className="heading-accent font-serif text-2xl text-ink">8. Refund Policy</h2>
            <p className="mt-3 font-semibold text-accent">Refunds can only be requested within 2 days of payment.</p>
            <p className="mt-3">
              After this period, no refunds will be issued as work on your service will have already commenced. We are
              committed to your satisfaction and will continue working on your documents until you are satisfied with the
              results.
            </p>
          </section>
          <section>
            <h2 className="heading-accent font-serif text-2xl text-ink">9. References Policy</h2>
            <p className="mt-3">
              You should avoid including references on your CV, as most Applicant Tracking Systems (ATS) cannot read
              them. This may reduce your chances of passing the initial screening stage.
            </p>
            <p className="mt-3">
              However, if you still prefer to have references included, we can add them upon request. Please note that in
              such cases, we cannot be held responsible if your application is rejected due to ATS incompatibility.
            </p>
          </section>
          <section>
            <h2 className="heading-accent font-serif text-2xl text-ink">10. Data Security & Privacy</h2>
            <p className="mt-3">
              We take data security seriously. All information you share is encrypted and stored securely. We never share
              your personal information with third parties, and you can request deletion of your data at any time.
            </p>
          </section>
          <section>
            <h2 className="heading-accent font-serif text-2xl text-ink">11. Intellectual Property</h2>
            <p className="mt-3">
              Once payment is received and your documents are completed, you own the rights to your CV, cover letter, and
              LinkedIn profile. We retain the right to use anonymized examples for marketing purposes.
            </p>
          </section>
          <section>
            <h2 className="heading-accent font-serif text-2xl text-ink">12. Limitation of Liability</h2>
            <p className="mt-3">
              While we strive to provide the highest quality service, we cannot guarantee employment outcomes. Creative
              CV is not responsible for hiring decisions made by employers or recruiters.
            </p>
          </section>
          <section>
            <h2 className="heading-accent font-serif text-2xl text-ink">13. Contact</h2>
            <p className="mt-3">
              If you have any questions about these Terms & Conditions, please contact us at{" "}
              <a className="content-link" href={`mailto:${site.email}`}>
                {site.email}
              </a>{" "}
              or call us at{" "}
              <a className="content-link" href={site.phoneHref}>
                {site.phone}
              </a>
            </p>
            <p className="mt-3">
              <strong>Opening Hours:</strong> Monday - Thursday: 8:00 AM - 4:00 PM | Friday: 8:00 AM - 1:00 PM
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
