import type { Metadata } from "next";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { SmartImage } from "@/components/SmartImage";
import { aboutCards, historyTimeline, homeCopy, school } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about St. Joseph's High School, its trust history, founders, values, mission, vision, and public school history."
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Welcome to {school.name}
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            Established in {school.establishedYear} under the aegis of the{" "}
            {school.parentSociety}, the school continues its work of academic
            excellence and character building.
          </p>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <SmartImage
            src="/images/campus.jpg"
            alt="Campus view"
            className="h-[420px] w-full rounded-lg object-cover shadow-soft"
            fallbackLabel="Campus"
          />
          <div>
            <SectionTitle align="left" title="Home Page / About Us" />
            <div className="grid gap-5 text-lg leading-8 text-slate-600">
              <p>{homeCopy.body}</p>
              <p>{homeCopy.philosophy}</p>
              <p>
                The website shares only public information and avoids private
                student data by design.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="site-container grid gap-6 lg:grid-cols-2">
          <article className="rounded-lg bg-white p-7 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
              Trust History & Founders
            </p>
            <h2 className="mt-3 text-3xl font-bold text-navy">
              {homeCopy.heritageTitle}
            </h2>
            <p className="mt-4 leading-7 text-slate-600">{homeCopy.heritage}</p>
          </article>
          <article className="rounded-lg bg-white p-7 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
              Founding Framework
            </p>
            <h2 className="mt-3 text-3xl font-bold text-navy">
              {homeCopy.foundingTitle}
            </h2>
            <p className="mt-4 leading-7 text-slate-600">{homeCopy.founding}</p>
          </article>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container">
          <SectionTitle title="Vision, Mission, Values" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {aboutCards.map((card) => (
              <Card key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="site-container">
          <SectionTitle
            title="School History Timeline"
            description="A concise public timeline that can be expanded with verified archival details."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {historyTimeline.map((item) => (
              <article key={item.year} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
                  {item.year}
                </p>
                <h2 className="mt-3 text-2xl font-bold text-navy">{item.title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
