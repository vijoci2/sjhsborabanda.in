import type { Metadata } from "next";
import { SectionTitle } from "@/components/UI/SectionTitle";
import { SmartImage } from "@/components/UI/SmartImage";
import { academicLevels } from "@/lib/data";

export const metadata: Metadata = {
  title: "Academics",
  description:
    "Academic programs at St. Joseph's High School from nursery and primary to middle school and high school."
};

export default function AcademicsPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Academics
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            Clear foundations, conceptual understanding, disciplined revision,
            and confidence for every stage of learning.
          </p>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container">
          <SectionTitle
            title="Academic Sections"
            description="A balanced pathway across early learning, middle years, and high school preparation."
          />
          <div className="grid gap-8">
            {academicLevels.map((level, index) => (
              <article
                key={level.title}
                className={`grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft lg:grid-cols-2 ${
                  index % 2 ? "lg:[&>div:first-child]:order-2" : ""
                }`}
              >
                <SmartImage
                  src={level.image}
                  alt={level.title}
                  fallbackLabel={level.title}
                  className="h-80 w-full object-cover lg:h-full"
                />
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-navy">{level.title}</h2>
                  <p className="mt-4 text-lg leading-8 text-slate-600">
                    {level.description}
                  </p>
                  <ul className="mt-6 grid gap-3">
                    {level.points.map((point) => (
                      <li key={point} className="flex gap-3 text-slate-700">
                        <span className="mt-2 h-2 w-2 rounded-full bg-gold" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="site-container grid gap-5 md:grid-cols-3">
          {["Regular assessment", "Practical learning", "Parent communication"].map(
            (item) => (
              <article key={item} className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-navy">{item}</h2>
                <p className="mt-3 leading-7 text-slate-600">
                  The academic program is structured to keep learning visible,
                  supportive, and connected to classroom progress.
                </p>
              </article>
            )
          )}
        </div>
      </section>
    </>
  );
}
