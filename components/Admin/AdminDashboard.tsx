"use client";

import { useEffect, useMemo, useState } from "react";
import { cmsApi } from "@/lib/appsScriptApi";
import { isPastEvent } from "@/lib/cmsFallback";
import type { ActivityLogEntry, CmsEvent, GalleryAlbum } from "@/types/cms";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-3xl font-bold text-navy">{value}</p>
      <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

export function AdminDashboard() {
  const [events, setEvents] = useState<CmsEvent[]>([]);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [message, setMessage] = useState("Loading dashboard...");

  useEffect(() => {
    let mounted = true;

    Promise.all([
      cmsApi.getAllEvents(),
      cmsApi.getAllAlbums(),
      cmsApi.getActivityLog()
    ]).then(([eventsResponse, albumsResponse, logsResponse]) => {
      if (!mounted) {
        return;
      }

      if (eventsResponse.success) {
        setEvents(eventsResponse.data?.events ?? []);
      }

      if (albumsResponse.success) {
        setAlbums(albumsResponse.data?.albums ?? []);
      }

      if (logsResponse.success) {
        setLogs(logsResponse.data?.logs ?? []);
      }

      setMessage(
        eventsResponse.success || albumsResponse.success
          ? ""
          : eventsResponse.message
      );
    });

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    return {
      totalEvents: events.length,
      publishedEvents: events.filter((event) => event.STATUS === "PUBLISHED").length,
      draftEvents: events.filter((event) => event.STATUS === "DRAFT").length,
      upcomingEvents: events.filter(
        (event) => event.STATUS === "PUBLISHED" && !isPastEvent(event)
      ).length,
      totalAlbums: albums.length,
      publishedAlbums: albums.filter((album) => album.STATUS === "PUBLISHED").length,
      totalPhotos: albums.reduce(
        (total, album) => total + Number(album.PHOTO_COUNT ?? 0),
        0
      )
    };
  }, [albums, events]);

  return (
    <div className="grid gap-6">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
          Overview
        </p>
        <h2 className="mt-2 text-3xl font-bold text-navy">CMS Dashboard</h2>
        <p className="mt-3 leading-7 text-slate-600">
          Manage permanent event records, gallery albums, published content, and
          recent activity from one simple dashboard.
        </p>
      </div>

      {message ? (
        <div className="rounded-lg border border-gold/30 bg-gold/10 p-4 text-sm leading-6 text-navy">
          {message}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total events" value={stats.totalEvents} />
        <StatCard label="Published events" value={stats.publishedEvents} />
        <StatCard label="Draft events" value={stats.draftEvents} />
        <StatCard label="Upcoming events" value={stats.upcomingEvents} />
        <StatCard label="Total albums" value={stats.totalAlbums} />
        <StatCard label="Published albums" value={stats.publishedAlbums} />
        <StatCard label="Gallery photos" value={stats.totalPhotos} />
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-bold text-navy">Recent Activity</h3>
        <div className="mt-4 grid gap-3">
          {logs.length ? (
            logs.slice(0, 8).map((log) => (
              <div
                key={log.LOG_ID}
                className="rounded-md border border-slate-200 p-3 text-sm"
              >
                <p className="font-bold text-navy">{log.ACTION}</p>
                <p className="mt-1 text-slate-600">
                  {log.ENTITY_TYPE} {log.ENTITY_ID} - {log.TIMESTAMP}
                </p>
              </div>
            ))
          ) : (
            <p className="text-slate-600">No recent activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
