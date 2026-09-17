import { buildCvDocument } from "@/lib/cv-document";
import type { GeneratorDraft } from "@/lib/generator";

export function CvPreview({ draft, watermark }: { draft: GeneratorDraft; watermark?: boolean }) {
  const cv = buildCvDocument(draft);

  return (
    <div className={watermark ? "cv-preview-frame watermark-layer" : "cv-preview-frame"}>
      <article className="cv-sheet">
        <p className="cv-name">{cv.fullName}</p>
        <p className="cv-headline">{cv.headline}</p>
        <p className="cv-contact">{cv.contact}</p>
        {cv.languages ? <p className="cv-languages">{cv.languages}</p> : null}

        {cv.summary ? (
          <section>
            <h2 className="cv-heading cv-heading-caps">Personal Summary</h2>
            <p className="cv-summary">{cv.summary}</p>
          </section>
        ) : null}

        {cv.education.length ? (
          <section>
            <h2 className="cv-heading">Education</h2>
            {cv.education.map((item) => (
              <p key={item} className="cv-line">
                {item}
              </p>
            ))}
          </section>
        ) : null}

        {cv.skills.length ? (
          <section>
            <h2 className="cv-heading">Key Skills</h2>
            <ul className="cv-skills">
              {cv.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {cv.experience.length ? (
          <section>
            <h2 className="cv-heading">Professional Experience</h2>
            {cv.experience.map((role, index) => (
              <div key={`${role.title}-${role.companyLine}-${index}`} className="cv-role">
                <div className="cv-role-head">
                  <p>{role.companyLine}</p>
                  {role.dates ? <p className="cv-role-dates">{role.dates}</p> : null}
                </div>
                {role.title ? <p className="cv-role-title">{role.title}</p> : null}
                {role.intro ? <p className="cv-role-intro">{role.intro}</p> : null}
                {role.bullets.length ? (
                  <ul className="cv-bullets">
                    {role.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        {cv.affiliations.length ? (
          <section>
            <h2 className="cv-heading">Professional Affiliations</h2>
            {cv.affiliations.map((item) => (
              <p key={item} className="cv-line">
                {item}
              </p>
            ))}
          </section>
        ) : null}

        {cv.development.length ? (
          <section>
            <h2 className="cv-heading">Professional Development</h2>
            {cv.development.map((item) => (
              <p key={item} className="cv-line">
                {item}
              </p>
            ))}
          </section>
        ) : null}

        {cv.awards.length ? (
          <section>
            <h2 className="cv-heading">Awards and Accomplishments</h2>
            {cv.awards.map((item) => (
              <p key={item} className="cv-line">
                {item}
              </p>
            ))}
          </section>
        ) : null}

        <section>
          <h2 className="cv-heading cv-heading-caps">References</h2>
          <ul className="cv-bullets">
            {cv.references.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}
