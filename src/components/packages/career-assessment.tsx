"use client";

import { useState, type ReactNode } from "react";
import {
  careerStages,
  emptyPosition,
  emptyQualification,
  type ExtraPosition,
  type ExtraQualification,
} from "@/lib/order-assessment";

type Props = {
  onBack: () => void;
  submitting: boolean;
  redirecting: boolean;
};

const field = "field";
const choice =
  "flex cursor-pointer items-center gap-2 rounded-xl border border-accent/30 bg-paper-deep px-4 py-3 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent-soft/50";

function Choice({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label className={choice}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="accent-[#c6a15b]" required />
      {children}
    </label>
  );
}

export function CareerAssessment({ onBack, submitting, redirecting }: Props) {
  const [extraInfo, setExtraInfo] = useState<"" | "yes" | "no">("");
  const [hasLinkedin, setHasLinkedin] = useState<"" | "yes" | "no">("");
  const [positions, setPositions] = useState<ExtraPosition[]>([emptyPosition()]);
  const [qualifications, setQualifications] = useState<ExtraQualification[]>([emptyQualification()]);

  function updatePosition(index: number, patch: Partial<ExtraPosition>) {
    setPositions((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function updateQualification(index: number, patch: Partial<ExtraQualification>) {
    setQualifications((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  return (
    <div>
      <p className="kicker">Career assessment</p>
      <h3 className="mt-2 font-serif text-2xl">Tell us about your career</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        A few short answers so your writer can position your CV for the role you want.
      </p>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-1 text-sm">
          Current role or job title
          <input required name="currentRole" className={field} placeholder="e.g. Branch Administrator" />
        </label>

        <label className="grid gap-1 text-sm">
          Where are you in your career?
          <select required name="careerStage" defaultValue="" className={field}>
            <option value="" disabled>
              Select your career stage
            </option>
            {careerStages.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          Target role
          <input required name="targetRole" className={field} placeholder="e.g. Operations Manager" />
        </label>

        <label className="grid gap-1 text-sm">
          Industry you are targeting
          <input required name="industry" className={field} placeholder="e.g. Banking, mining, healthcare" />
        </label>

        <label className="grid gap-1 text-sm">
          Career targets
          <textarea
            required
            name="careerTargets"
            rows={4}
            className={field}
            placeholder="Promotion, a new country, a career change, higher pay — what should this CV help you achieve?"
          />
        </label>

        <label className="grid gap-1 text-sm">
          Who referred you to us?
          <input required name="referredBy" className={field} placeholder="e.g. A friend, Google, Facebook, a colleague" />
        </label>

        <fieldset className="grid gap-2">
          <legend className="text-sm">Do you have information that is not on the CV you submitted?</legend>
          <div className="grid grid-cols-2 gap-2">
            <Choice name="extraInfo" value="no" checked={extraInfo === "no"} onChange={() => setExtraInfo("no")}>
              No
            </Choice>
            <Choice name="extraInfo" value="yes" checked={extraInfo === "yes"} onChange={() => setExtraInfo("yes")}>
              Yes
            </Choice>
          </div>
          <p className="text-xs text-ink-soft">If no, continue to payment. If yes, we will ask a few extra questions.</p>
        </fieldset>
      </div>

      {extraInfo === "yes" ? (
        <div className="mt-8 grid gap-4">
          <p className="font-serif text-xl">Extra information for your writer</p>

          <label className="grid gap-1 text-sm">
            Achievements, if you have any
            <textarea name="achievements" rows={3} className={field} placeholder="Awards, targets hit, promotions, projects" />
          </label>

          <label className="grid gap-1 text-sm">
            Memberships
            <textarea name="memberships" rows={2} className={field} placeholder="Professional bodies, associations, institutes" />
          </label>

          <fieldset className="grid gap-2">
            <legend className="text-sm">Top 5 skills you have</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {Array.from({ length: 5 }, (_, index) => (
                <input
                  key={`skill-${index}`}
                  required
                  name={`skill${index + 1}`}
                  className={field}
                  placeholder={`Skill ${index + 1}`}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="grid gap-2">
            <legend className="text-sm">Top 7 technical skills</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {Array.from({ length: 7 }, (_, index) => (
                <input
                  key={`tech-${index}`}
                  required
                  name={`techSkill${index + 1}`}
                  className={field}
                  placeholder={`Technical skill ${index + 1}`}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="grid gap-2">
            <legend className="text-sm">Do you have a LinkedIn account?</legend>
            <div className="grid grid-cols-2 gap-2">
              <Choice name="hasLinkedin" value="no" checked={hasLinkedin === "no"} onChange={() => setHasLinkedin("no")}>
                No
              </Choice>
              <Choice name="hasLinkedin" value="yes" checked={hasLinkedin === "yes"} onChange={() => setHasLinkedin("yes")}>
                Yes
              </Choice>
            </div>
          </fieldset>

          {hasLinkedin === "yes" ? (
            <label className="grid gap-1 text-sm">
              LinkedIn link
              <input required type="url" name="linkedinUrl" className={field} placeholder="https://www.linkedin.com/in/your-name" />
            </label>
          ) : null}

          <div className="grid gap-3">
            <p className="text-sm font-semibold">Positions you want to add</p>
            <p className="text-xs text-ink-soft">Company name, start year, and end year or current.</p>
            {positions.map((item, index) => (
              <div key={`position-${index}`} className="grid gap-2 rounded-xl border border-accent/20 p-3">
                <label className="grid gap-1 text-sm">
                  Company name
                  <input name="positionCompany" value={item.company} onChange={(event) => updatePosition(index, { company: event.target.value })} className={field} />
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="grid gap-1 text-sm">
                    Start year
                    <input
                      name="positionStartYear"
                      inputMode="numeric"
                      placeholder="2019"
                      value={item.startYear}
                      onChange={(event) => updatePosition(index, { startYear: event.target.value })}
                      className={field}
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    End year
                    <input
                      name="positionEndYear"
                      inputMode="numeric"
                      placeholder="2024"
                      value={item.current ? "Current" : item.endYear}
                      onChange={(event) => updatePosition(index, { endYear: event.target.value, current: false })}
                      readOnly={item.current}
                      className={field}
                    />
                  </label>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.current}
                    onChange={(event) =>
                      updatePosition(index, { current: event.target.checked, endYear: event.target.checked ? "Current" : "" })
                    }
                    className="accent-[#c6a15b]"
                  />
                  Current role
                </label>
                <input type="hidden" name="positionCurrent" value={item.current ? "yes" : "no"} />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setPositions((current) => [...current, emptyPosition()])}
              className="justify-self-start text-sm font-semibold text-accent hover:underline"
            >
              Add another position
            </button>
          </div>

          <div className="grid gap-3">
            <p className="text-sm font-semibold">Qualifications you want to add</p>
            <p className="text-xs text-ink-soft">Institute name, start date, end date, and certificate name.</p>
            {qualifications.map((item, index) => (
              <div key={`qual-${index}`} className="grid gap-2 rounded-xl border border-accent/20 p-3">
                <label className="grid gap-1 text-sm">
                  Institute name
                  <input
                    name="qualInstitute"
                    value={item.institute}
                    onChange={(event) => updateQualification(index, { institute: event.target.value })}
                    className={field}
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  Certificate name
                  <input
                    name="qualCertificate"
                    value={item.certificate}
                    onChange={(event) => updateQualification(index, { certificate: event.target.value })}
                    className={field}
                  />
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="grid gap-1 text-sm">
                    Start date
                    <input
                      type="month"
                      name="qualStartDate"
                      value={item.startDate}
                      onChange={(event) => updateQualification(index, { startDate: event.target.value })}
                      className={field}
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    End date
                    <input
                      type="month"
                      name="qualEndDate"
                      value={item.endDate}
                      onChange={(event) => updateQualification(index, { endDate: event.target.value })}
                      className={field}
                    />
                  </label>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setQualifications((current) => [...current, emptyQualification()])}
              className="justify-self-start text-sm font-semibold text-accent hover:underline"
            >
              Add another qualification
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-3">
        <button
          type="submit"
          disabled={submitting || redirecting || extraInfo === ""}
          className="w-full rounded-full bg-accent py-3 text-sm font-bold uppercase tracking-[0.14em] text-on-accent hover:bg-accent-hover disabled:opacity-60"
        >
          {submitting ? "Submitting…" : redirecting ? "Redirecting to Paystack…" : "Continue to payment"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-full border border-accent/40 py-3 text-sm font-semibold text-ink hover:bg-accent-soft"
        >
          Back to your details
        </button>
      </div>
    </div>
  );
}
