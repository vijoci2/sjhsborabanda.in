import type { Metadata } from "next";
import { SectionTitle } from "@/components/SectionTitle";
import { SmartImage } from "@/components/SmartImage";
import { facilities } from "@/lib/data";

export const metadata: Metadata = {
  title: "Facilities",
  description:
    "Facilities at St. Joseph's High School including classrooms, science labs, sports, cultural spaces, and campus care."
};

export default function FacilitiesPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Facilities
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            Spaces designed to support classroom learning, practical exposure,
            activity, culture, and campus safety.
          </p>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container">
          <SectionTitle
            title="Campus Facilities"
            description="Clean image cards show public-facing facility areas without exposing private student information."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => (
              <article
                key={facility.title}
                className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-lift"
              >
                <SmartImage
                  src={facility.image}
                  alt={facility.title}
                  fallbackLabel={facility.title}
                  className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-navy">{facility.title}</h2>
                  <p className="mt-3 leading-7 text-slate-600">
                    {facility.description}
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
