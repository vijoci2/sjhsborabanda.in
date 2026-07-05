import type { Metadata } from "next";
import { SectionTitle } from "@/components/SectionTitle";
import { historyTimeline, school } from "@/lib/data";

export const metadata: Metadata = {
  title: "School History",
  description:
    "Public history timeline for St. Joseph's High School, Borabanda, Hyderabad."
};

export default function SchoolHistoryPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            School History
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            The story of {school.name} is a story of community, learning,
            discipline, and steady service.
          </p>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container">
          <SectionTitle
            title="A Legacy of Education"
            description="Sample public history content is organized for easy replacement with verified school archives."
          />
          <div className="relative grid gap-6">
            {historyTimeline.map((item, index) => (
              <article
                key={item.year}
                className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[160px_1fr]"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-navy text-sm font-bold text-gold">
                    {index + 1}
                  </span>
                  <span className="text-xl font-bold text-navy">{item.year}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-navy">{item.title}</h2>
                  <p className="mt-3 leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
