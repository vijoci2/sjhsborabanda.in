"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cmsApi } from "@/lib/appsScriptApi";
import { formatCmsDate, isPastEvent, isTodayEvent } from "@/lib/cmsFallback";
import type { CmsEvent, CmsStatus } from "@/types/cms";

type EventFilter = "ALL" | CmsStatus | "UPCOMING" | "TODAY" | "PAST";

export function AdminEventsManager() {
  const [events, setEvents] = useState<CmsEvent[]>([]);
  const [filter, setFilter] = useState<EventFilter>("ALL");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("Loading events...");
  const [savingId, setSavingId] = useState("");

  async function loadEvents() {
    const response = await cmsApi.getAllEvents();
    if (response.success) {
      setEvents(response.data?.events ?? []);
      setMessage("");
    } else {
      setMessage(response.message);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const visibleEvents = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    return events
      .filter((event) => {
        if (filter === "UPCOMING") {
          return !isPastEvent(event) && !isTodayEvent(event);
        }
        if (filter === "TODAY") {
          return isTodayEvent(event);
        }
        if (filter === "PAST") {
          return isPastEvent(event);
        }
        if (filter === "ALL") {
          return true;
        }
        return event.STATUS === filter;
      })
      .filter((event) =>
        cleanQuery
          ? `${event.TITLE} ${event.LOCATION} ${event.ACADEMIC_YEAR}`
              .toLowerCase()
              .includes(cleanQuery)
          : true
      )
      .sort((a, b) => a.EVENT_DATE.localeCompare(b.EVENT_DATE));
  }, [events, filter, query]);

  async function runAction(
    eventId: string,
    label: string,
    action: () => Promise<{ success: boolean; message: string }>
  ) {
    if (!window.confirm(`${label} this event?`)) {
      return;
    }

    setSavingId(eventId);
    const response = await action();
    setMessage(response.message);
    setSavingId("");
    await loadEvents();
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
            Permanent Event Diary
          </p>
          <h2 className="mt-2 text-3xl font-bold text-navy">Events</h2>
          <p className="mt-2 max-w-2xl leading-7 text-slate-600">
            Keep upcoming, today, and past events as a permanent archive. Add
            new photographs later without replacing old records.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="focus-ring rounded-md bg-navy px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.12em] text-white"
        >
          Add Event
        </Link>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search events"
            className="focus-ring rounded-md border border-slate-200 px-3 py-3"
          />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as EventFilter)}
            className="focus-ring rounded-md border border-slate-200 px-3 py-3"
          >
            <option value="ALL">All events</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="TODAY">Today</option>
            <option value="PAST">Past</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {message ? (
        <div className="rounded-lg border border-gold/30 bg-gold/10 p-4 text-sm text-navy">
          {message}
        </div>
      ) : null}

      <div className="grid gap-4">
        {visibleEvents.length ? (
          visibleEvents.map((event) => (
            <article key={event.EVENT_ID} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                    <span className="rounded bg-navy px-2 py-1 text-white">
                      {event.STATUS}
                    </span>
                    <span className="rounded bg-gold/20 px-2 py-1 text-navy">
                      {isTodayEvent(event)
                        ? "Today"
                        : isPastEvent(event)
                          ? "Past"
                          : "Upcoming"}
                    </span>
                  </div>
                  <h3 className="mt-3 text-2xl font-bold text-navy">
                    {event.TITLE}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-gold">
                    {formatCmsDate(event.EVENT_DATE)} {event.EVENT_TIME}
                  </p>
                  <p className="mt-3 leading-7 text-slate-600">
                    {event.SHORT_DESCRIPTION || event.DESCRIPTION}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {event.LOCATION} {event.PHOTO_COUNT ? `- ${event.PHOTO_COUNT} photos` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <Link
                    href={`/admin/events/${event.EVENT_ID}/edit`}
                    className="focus-ring rounded-md border border-navy px-3 py-2 text-sm font-bold text-navy"
                  >
                    Edit
                  </Link>
                  {event.STATUS !== "PUBLISHED" ? (
                    <button
                      type="button"
                      disabled={savingId === event.EVENT_ID}
                      onClick={() =>
                        runAction(event.EVENT_ID, "Publish", () =>
                          cmsApi.publishEvent(event.EVENT_ID)
                        )
                      }
                      className="focus-ring rounded-md bg-navy px-3 py-2 text-sm font-bold text-white"
                    >
                      Publish
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={savingId === event.EVENT_ID}
                      onClick={() =>
                        runAction(event.EVENT_ID, "Unpublish", () =>
                          cmsApi.unpublishEvent(event.EVENT_ID)
                        )
                      }
                      className="focus-ring rounded-md bg-gold px-3 py-2 text-sm font-bold text-navy"
                    >
                      Unpublish
                    </button>
                  )}
                  {event.STATUS === "ARCHIVED" ? (
                    <button
                      type="button"
                      disabled={savingId === event.EVENT_ID}
                      onClick={() =>
                        runAction(event.EVENT_ID, "Restore", () =>
                          cmsApi.restoreEvent(event.EVENT_ID)
                        )
                      }
                      className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-navy"
                    >
                      Restore
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={savingId === event.EVENT_ID}
                      onClick={() =>
                        runAction(event.EVENT_ID, "Archive", () =>
                          cmsApi.archiveEvent(event.EVENT_ID)
                        )
                      }
                      className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-navy"
                    >
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-lg bg-white p-6 text-center text-slate-600 shadow-sm">
            No events match this view.
          </div>
        )}
      </div>
    </div>
  );
}
