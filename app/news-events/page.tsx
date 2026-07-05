import type { Metadata } from "next";
import { EventCard } from "@/components/EventCard";
import { SectionTitle } from "@/components/SectionTitle";
import { events, newsItems } from "@/lib/data";

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
          <SectionTitle title="Latest News" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item) => (
              <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lift">
                <p className="text-sm font-bold text-gold">
                  {new Date(item.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </p>
                <h2 className="mt-3 text-2xl font-bold text-navy">{item.title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="site-container">
          <SectionTitle title="Upcoming Events" />
          <div className="grid gap-5 md:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.title} {...event} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
