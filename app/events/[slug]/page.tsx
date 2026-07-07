import type { Metadata } from "next";
import { PublicEventDetail } from "@/components/CMS/PublicEvents";

export const metadata: Metadata = {
  title: "Event Details"
};

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;

  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Event Details
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            Event information and photographs from the permanent school diary.
          </p>
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="site-container">
          <PublicEventDetail slug={slug} />
        </div>
      </section>
    </>
  );
}
