import type { Metadata } from "next";
import Link from "next/link";
import { PublicEvents } from "@/components/CMS/PublicEvents";
import { SectionTitle } from "@/components/UI/SectionTitle";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming events, today's events, and recent past events from the permanent school event diary."
};

export default function EventsPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Events Diary
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            A permanent archive of school celebrations, activities, programmes,
            and campus memories.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/events/upcoming"
              className="focus-ring rounded-md bg-gold px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-navy"
            >
              Upcoming Events
            </Link>
            <Link
              href="/events/archive"
              className="focus-ring rounded-md border border-white/30 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white"
            >
              Events Archive
            </Link>
          </div>
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="site-container">
          <SectionTitle
            title="School Events"
            description="Upcoming events appear first. Past events remain available as a historical diary."
          />
          <PublicEvents />
        </div>
      </section>
    </>
  );
}
