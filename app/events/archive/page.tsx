import type { Metadata } from "next";
import { PublicEvents } from "@/components/CMS/PublicEvents";
import { SectionTitle } from "@/components/UI/SectionTitle";

export const metadata: Metadata = {
  title: "Events Archive",
  description:
    "Permanent events archive and school diary for St. Joseph's High School."
};

export default function EventsArchivePage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Events Archive
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            Browse past school events by year, month, title, and location.
          </p>
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="site-container">
          <SectionTitle
            title="Permanent School Diary"
            description="Past events and photographs remain available across academic years."
          />
          <PublicEvents mode="archive" />
        </div>
      </section>
    </>
  );
}
