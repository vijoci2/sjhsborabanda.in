import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SectionTitle } from "@/components/SectionTitle";
import {
  admissionAgeCriteria,
  admissionDocuments,
  admissionProcess,
  school
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Admissions enquiry information and UI form for St. Joseph's High School, Borabanda."
};

export default function AdmissionsPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Admissions Policy & Guidelines
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            Start with a public enquiry, review the age criteria and document
            checklist, then contact the administration for a campus visit.
          </p>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionTitle align="left" title="Age Criteria" />
            <div className="grid gap-4">
              {admissionAgeCriteria.map((item) => (
                <article
                  key={item.level}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-navy">{item.level}</h2>
                  <p className="mt-2 leading-7 text-slate-600">{item.criteria}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-lg bg-mist p-6">
              <h2 className="text-2xl font-bold text-navy">
                Required Documentation
              </h2>
              <ul className="mt-4 grid gap-3">
                {admissionDocuments.map((document) => (
                  <li key={document} className="flex gap-3 leading-7 text-slate-600">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />
                    {document}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ContactForm mode="admission" />
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="site-container">
          <SectionTitle
            title="The 4-Step Process"
            description="A clear admissions path from registration to enrollment."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {admissionProcess.map((step, index) => (
              <article
                key={step.title}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-navy text-sm font-bold text-gold">
                    {index + 1}
                  </span>
                  <h2 className="text-xl font-bold text-navy">{step.title}</h2>
                </div>
                <p className="leading-7 text-slate-600">{step.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 rounded-lg bg-navy p-8 text-white shadow-soft">
            <h2 className="text-2xl font-bold">
              Schedule a Campus Visit / Contact Administration
            </h2>
            <p className="mt-3 leading-7 text-white/75">
              Contact {school.phone} or {school.email} during office timings
              for public admissions guidance and campus visit coordination.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
