"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cmsApi } from "@/lib/appsScriptApi";
import {
  fallbackEvents,
  formatCmsDate,
  isPastEvent,
  isTodayEvent
} from "@/lib/cmsFallback";
import type { CmsEvent, EventPhoto } from "@/types/cms";
import { SmartImage } from "@/components/UI/SmartImage";

type EventMode = "home" | "upcoming" | "archive";

export function PublicEvents({ mode = "home" }: { mode?: EventMode }) {
  const [events, setEvents] = useState<CmsEvent[]>(fallbackEvents);
  const [message, setMessage] = useState("");
  const [year, setYear] = useState("ALL");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const request =
      mode === "upcoming"
        ? cmsApi.getUpcomingEvents()
        : mode === "archive"
          ? cmsApi.getArchivedEvents()
          : cmsApi.getPublishedEvents();

    request.then((response) => {
      if (response.success && response.data?.events?.length) {
        setEvents(response.data.events);
        setMessage("");
      } else if (!response.success && response.errorCode !== "CMS_NOT_CONFIGURED") {
        setMessage(response.message);
      }
    });
  }, [mode]);

  const years = useMemo(
    () => ["ALL", ...Array.from(new Set(events.map((event) => event.ACADEMIC_YEAR).filter(Boolean)))],
    [events]
  );

  const filteredEvents = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    return events
      .filter((event) => {
        if (mode === "upcoming") {
          return !isPastEvent(event);
        }
        if (mode === "archive") {
          return isPastEvent(event) || event.STATUS === "ARCHIVED";
        }
        return true;
      })
      .filter((event) => (year === "ALL" ? true : event.ACADEMIC_YEAR === year))
      .filter((event) =>
        cleanQuery
          ? `${event.TITLE} ${event.DESCRIPTION} ${event.LOCATION}`
              .toLowerCase()
              .includes(cleanQuery)
          : true
      )
      .sort((a, b) =>
        mode === "archive"
          ? b.EVENT_DATE.localeCompare(a.EVENT_DATE)
          : a.EVENT_DATE.localeCompare(b.EVENT_DATE)
      );
  }, [events, mode, query, year]);

  const todayEvents = filteredEvents.filter(isTodayEvent);
  const upcomingEvents = filteredEvents.filter(
    (event) => !isTodayEvent(event) && !isPastEvent(event)
  );
  const pastEvents = filteredEvents.filter(
    (event) => isPastEvent(event) || event.STATUS === "ARCHIVED"
  );

  if (mode === "archive") {
    return (
      <EventListShell
        message={message}
        year={year}
        years={years}
        query={query}
        setYear={setYear}
        setQuery={setQuery}
      >
        <EventGrid
          title="All Events Archive"
          events={pastEvents}
          empty="No archived events are available yet."
        />
      </EventListShell>
    );
  }

  if (mode === "upcoming") {
    return (
      <EventListShell
        message={message}
        year={year}
        years={years}
        query={query}
        setYear={setYear}
        setQuery={setQuery}
      >
        <EventGrid
          title="Today's Events"
          events={todayEvents}
          empty="No events are scheduled for today."
        />
        <EventGrid
          title="Upcoming Events"
          events={upcomingEvents}
          empty="No upcoming events have been announced yet. Please check again soon."
        />
      </EventListShell>
    );
  }

  return (
    <EventListShell
      message={message}
      year={year}
      years={years}
      query={query}
      setYear={setYear}
      setQuery={setQuery}
    >
      <EventGrid
        title="Today's Events"
        events={todayEvents}
        empty="No events are scheduled for today."
      />
      <EventGrid
        title="Upcoming Events"
        events={upcomingEvents}
        empty="No upcoming events have been announced yet. Please check again soon."
      />
      <EventGrid
        title="Recent Past Events"
        events={pastEvents.slice(0, 6)}
        empty="Past events will appear here as the school diary grows."
      />
    </EventListShell>
  );
}

function EventListShell({
  children,
  message,
  year,
  years,
  query,
  setYear,
  setQuery
}: {
  children: React.ReactNode;
  message: string;
  year: string;
  years: string[];
  query: string;
  setYear: (year: string) => void;
  setQuery: (query: string) => void;
}) {
  return (
    <div className="grid gap-8">
      <div className="grid gap-3 rounded-lg bg-white p-5 shadow-sm lg:grid-cols-[1fr_220px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search event title, location, or description"
          className="focus-ring rounded-md border border-slate-200 px-3 py-3"
        />
        <select
          value={year}
          onChange={(event) => setYear(event.target.value)}
          className="focus-ring rounded-md border border-slate-200 px-3 py-3"
        >
          {years.map((item) => (
            <option key={item} value={item}>
              {item === "ALL" ? "All years" : item}
            </option>
          ))}
        </select>
      </div>
      {message ? (
        <div className="rounded-lg border border-gold/30 bg-gold/10 p-4 text-sm text-navy">
          {message}
        </div>
      ) : null}
      {children}
    </div>
  );
}

function EventGrid({
  title,
  events,
  empty
}: {
  title: string;
  events: CmsEvent[];
  empty: string;
}) {
  return (
    <section>
      <h2 className="text-3xl font-bold text-navy">{title}</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {events.length ? (
          events.map((event) => <EventCard key={event.EVENT_ID} event={event} />)
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600 shadow-sm md:col-span-2 lg:col-span-3">
            {empty}
          </div>
        )}
      </div>
    </section>
  );
}

function EventCard({ event }: { event: CmsEvent }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lift">
      <SmartImage
        src={event.COVER_PHOTO_URL || "/images/gallery/annual-day.jpg"}
        alt={event.TITLE}
        fallbackLabel="Event"
        className="aspect-[3/2] w-full object-cover"
      />
      <div className="p-5">
        <p className="text-sm font-bold text-gold">{formatCmsDate(event.EVENT_DATE)}</p>
        <h3 className="mt-2 text-2xl font-bold text-navy">{event.TITLE}</h3>
        <p className="mt-2 leading-7 text-slate-600">
          {event.SHORT_DESCRIPTION || event.DESCRIPTION}
        </p>
        <p className="mt-3 text-sm font-semibold text-slate-500">
          {event.LOCATION} {event.PHOTO_COUNT ? `- ${event.PHOTO_COUNT} photos` : ""}
        </p>
        <Link
          href={`/events/${event.SLUG}`}
          className="focus-ring mt-5 inline-flex rounded-md bg-navy px-4 py-2 text-sm font-bold text-white"
        >
          View Event
        </Link>
      </div>
    </article>
  );
}

export function PublicEventDetail({ slug }: { slug: string }) {
  const fallbackEvent = fallbackEvents.find((event) => event.SLUG === slug);
  const [event, setEvent] = useState<CmsEvent | null>(fallbackEvent ?? null);
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [message, setMessage] = useState(fallbackEvent ? "" : "Loading event...");

  useEffect(() => {
    cmsApi.getEventBySlug(slug).then((response) => {
      if (response.success && response.data?.event) {
        setEvent(response.data.event);
        setPhotos(response.data.photos ?? []);
        setMessage("");
      } else if (!fallbackEvent) {
        setMessage(response.message);
      }
    });
  }, [fallbackEvent, slug]);

  if (!event) {
    return (
      <div className="rounded-lg bg-white p-6 text-center text-slate-600 shadow-sm">
        {message || "Event not found."}
      </div>
    );
  }

  return (
    <article className="grid gap-8">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
          {formatCmsDate(event.EVENT_DATE)} {event.EVENT_TIME}
        </p>
        <h1 className="mt-3 text-4xl font-bold text-navy">{event.TITLE}</h1>
        <p className="mt-3 text-slate-600">{event.LOCATION}</p>
        <p className="mt-5 whitespace-pre-line leading-8 text-slate-700">
          {event.DESCRIPTION}
        </p>
      </div>

      <SmartImage
        src={event.COVER_PHOTO_URL || "/images/gallery/annual-day.jpg"}
        alt={event.TITLE}
        fallbackLabel="Event"
        className="max-h-[560px] w-full rounded-lg object-cover shadow-soft"
      />

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-bold text-navy">Event Photographs</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photos.length ? (
            photos
              .slice()
              .sort((a, b) => Number(a.DISPLAY_ORDER) - Number(b.DISPLAY_ORDER))
              .map((photo) => (
                <figure key={photo.PHOTO_ID} className="overflow-hidden rounded-lg border border-slate-200">
                  <SmartImage
                    src={photo.IMAGE_URL}
                    alt={photo.ALT_TEXT || photo.CAPTION || event.TITLE}
                    fallbackLabel="Photo"
                    className="aspect-[3/2] w-full object-cover"
                  />
                  {photo.CAPTION || photo.PERSON_NAMES ? (
                    <figcaption className="p-4 text-sm leading-6 text-slate-600">
                      {photo.CAPTION}
                      {photo.PERSON_NAMES ? (
                        <span className="block font-semibold text-navy">
                          {photo.PERSON_NAMES}
                        </span>
                      ) : null}
                    </figcaption>
                  ) : null}
                </figure>
              ))
          ) : (
            <p className="text-slate-600">Photographs will be added soon.</p>
          )}
        </div>
      </section>
    </article>
  );
}
