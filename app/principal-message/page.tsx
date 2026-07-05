import type { Metadata } from "next";
import { SectionTitle } from "@/components/SectionTitle";
import { SmartImage } from "@/components/SmartImage";
import { leadershipTeam, school } from "@/lib/data";

export const metadata: Metadata = {
  title: "Principal's Message",
  description:
    "Welcome message from the principal of St. Joseph's High School, Borabanda."
};

export default function PrincipalMessagePage() {
  const principal = leadershipTeam.find((leader) => leader.role === "Principal")!;

  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Principal's Message
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            A warm welcome from {principal.name}, Principal of {school.name}.
          </p>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SmartImage
            src="/images/principal.jpg"
            alt={principal.name}
            className="h-[520px] w-full rounded-lg object-cover shadow-soft"
            fallbackLabel="Principal"
          />
          <article>
            <SectionTitle align="left" title={principal.name} />
            <div className="grid gap-5 text-lg leading-8 text-slate-600">
              <p>{principal.bio}</p>
              <p>
                It is a privilege to welcome you to {school.name}. Our school
                believes that education must prepare students not only for
                examinations, but also for thoughtful citizenship, service, and
                lifelong learning.
              </p>
              <p>
                We encourage every child to develop strong study habits, clear
                communication, respect for others, and the confidence to
                participate in academics, sports, arts, and community life.
              </p>
              <p>
                Together with parents, teachers, staff, and alumni, we continue
                to build a school culture that is modern in its methods and
                timeless in its values.
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
