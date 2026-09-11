"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cmsApi } from "@/lib/appsScriptApi";
import { formatCmsDate, isPastEvent, isTodayEvent } from "@/lib/cmsFallback";
import type { CmsEvent } from "@/types/cms";

export function HomeNewsEvents() {
  const [events, setEvents] = useState<CmsEvent[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    cmsApi.getPublishedEvents().then((response) => {
      if (response.success) {
        setEvents(response.data?.events ?? []);
        setMessage("");
      } else if (response.errorCode !== "CMS_NOT_CONFIGURED") {
        setMessage(response.message);
      }
    });
  }, []);

  const latestNews = useMemo(
    () =>
      events
        .slice()
        .sort((a, b) => b.EVENT_DATE.localeCompare(a.EVENT_DATE))
        .slice(0, 4),
    [events]
  );

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((event) => !isPastEvent(event) && !isTodayEvent(event))
        .sort((a, b) => a.EVENT_DATE.localeCompare(b.EVENT_DATE))
        .slice(0, 4),
    [events]
  );

  return (
    <div className="site-container grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
            Updates
          </p>
          <h2 className="mt-2 text-4xl font-bold text-navy">Latest News</h2>
        </div>
        <div className="grid gap-4">
          {latestNews.length ? (
            latestNews.map((event) => (
              <HomeUpdateCard key={event.EVENT_ID} event={event} />
            ))
          ) : (
            <EmptyCard text="No latest news has been published yet." />
          )}
        </div>
      </div>
      <div>
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
            Calendar
          </p>
          <h2 className="mt-2 text-4xl font-bold text-navy">Upcoming Events</h2>
        </div>
        <div className="grid gap-5">
          {upcomingEvents.length ? (
            upcomingEvents.map((event) => (
              <HomeEventCard key={event.EVENT_ID} event={event} />
            ))
          ) : (
            <EmptyCard text="No upcoming events have been announced yet." />
          )}
        </div>
      </div>
      {message ? (
        <div className="rounded-lg border border-gold/30 bg-gold/10 p-4 text-sm text-navy lg:col-span-2">
          {message}
        </div>
      ) : null}
    </div>
  );
}

function HomeUpdateCard({ event }: { event: CmsEvent }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-gold/60">
      <p className="text-sm font-bold text-gold">{formatCmsDate(event.EVENT_DATE)}</p>
      <h3 className="mt-2 text-xl font-semibold text-navy">{event.TITLE}</h3>
      <p className="mt-2 leading-7 text-slate-600">
        {event.SHORT_DESCRIPTION || event.DESCRIPTION}
      </p>
      <Link
        href={`/events/${event.SLUG}`}
        className="focus-ring mt-4 inline-flex rounded-md border border-navy px-3 py-2 text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
      >
        Read More
      </Link>
    </article>
  );
}

function HomeEventCard({ event }: { event: CmsEvent }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="mb-5 inline-flex rounded-lg bg-gold/15 px-4 py-3 text-sm font-bold text-navy">
        {formatCmsDate(event.EVENT_DATE)}
      </div>
      <h3 className="text-xl font-semibold text-navy">{event.TITLE}</h3>
      <p className="mt-3 leading-7 text-slate-600">
        {event.SHORT_DESCRIPTION || event.DESCRIPTION}
      </p>
      <Link
        href={`/events/${event.SLUG}`}
        className="focus-ring mt-4 inline-flex rounded-md bg-navy px-3 py-2 text-sm font-bold text-white"
      >
        View Event
      </Link>
    </article>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
      {text}
    </div>
  );
}
