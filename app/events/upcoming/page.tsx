import type { Metadata } from "next";
import { PublicEvents } from "@/components/CMS/PublicEvents";
import { SectionTitle } from "@/components/UI/SectionTitle";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description: "Upcoming and today's events at St. Joseph's High School."
};

export default function UpcomingEventsPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Upcoming Events
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            Current and upcoming school programmes for families and visitors.
          </p>
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="site-container">
          <SectionTitle title="Upcoming and Today's Events" />
          <PublicEvents mode="upcoming" />
        </div>
      </section>
    </>
  );
}
