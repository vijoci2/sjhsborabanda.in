import type { Metadata } from "next";
import { SectionTitle } from "@/components/SectionTitle";
import { SmartImage } from "@/components/SmartImage";
import { leadershipTeam, school } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Leadership",
  description:
    "Leadership and administration team of St. Joseph's High School, Borabanda, including the Principal, Director, and Correspondent."
};

export default function LeadershipPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Our Leadership Team
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            Academic dedication, modern educational thinking, and accountable
            administration guide the daily life and long-term vision of{" "}
            {school.name}.
          </p>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container">
          <SectionTitle
            title="Leadership & Administration"
            description="Meet the team responsible for academic operations, long-term vision, infrastructure, and strategic growth."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {leadershipTeam.map((leader) => (
              <article
                key={leader.name}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft"
              >
                <SmartImage
                  src={leader.image}
                  alt={leader.name}
                  fallbackLabel={leader.role}
                  className="h-72 w-full object-cover"
                />
                <div className="p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
                    {leader.role}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold leading-tight text-navy">
                    {leader.name}
                  </h2>
                  <p className="mt-4 leading-7 text-slate-600">{leader.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="site-container grid gap-6 lg:grid-cols-3">
          {[
            "Academic discipline",
            "Digital learning integration",
            "Infrastructure and faculty support"
          ].map((item) => (
            <article key={item} className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-navy">{item}</h2>
              <p className="mt-3 leading-7 text-slate-600">
                The leadership team works to preserve the school's heritage
                while strengthening modern classroom practice and student
                support.
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
