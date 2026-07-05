import type { Metadata } from "next";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { achievements, stats } from "@/lib/data";

export const metadata: Metadata = {
  title: "Achievements",
  description:
    "Public achievements and school excellence statistics for St. Joseph's High School."
};

export default function AchievementsPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Achievements
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            Celebrating public milestones in academics, culture, sports, and
            school life.
          </p>
        </div>
      </section>

      <section className="bg-mist py-12">
        <div className="site-container grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg bg-white p-6 text-center shadow-sm">
              <p className="text-4xl font-bold text-navy">{stat.value}</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container">
          <SectionTitle
            title="Areas of Recognition"
            description="Public achievement categories are presented without exposing private student records."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {achievements.map((achievement) => (
              <Card key={achievement.title} {...achievement} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
