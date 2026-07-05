import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SectionTitle } from "@/components/SectionTitle";
import { alumniStories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Alumni",
  description:
    "Alumni memories, achievements, and registration UI for St. Joseph's High School."
};

export default function AlumniPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Alumni
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            Once a Josephite, always a Josephite. Share memories, celebrate
            achievements, and stay connected with the school community.
          </p>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionTitle align="left" title="Alumni Memories" />
            <div className="grid gap-5">
              {alumniStories.map((story) => (
                <article key={story.name} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-gold">
                    {story.role}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-navy">
                    {story.name}
                  </h2>
                  <p className="mt-3 leading-7 text-slate-600">{story.quote}</p>
                </article>
              ))}
            </div>
          </div>
          <ContactForm mode="alumni" />
        </div>
      </section>
    </>
  );
}
