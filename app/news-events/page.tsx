import type { Metadata } from "next";
import { PublicEvents } from "@/components/CMS/PublicEvents";
import { SectionTitle } from "@/components/UI/SectionTitle";

export const metadata: Metadata = {
  title: "News & Events",
  description:
    "Public news and upcoming events at St. Joseph's High School, Borabanda."
};

export default function NewsEventsPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            News & Events
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            Public updates, school activities, celebrations, and upcoming
            programs for families and visitors.
          </p>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container">
          <SectionTitle
            title="Latest News & Upcoming Events"
            description="Updates shown here are managed from the admin event diary."
          />
          <PublicEvents />
        </div>
      </section>
    </>
  );
}
