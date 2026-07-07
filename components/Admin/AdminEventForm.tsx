"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cmsApi, fileToUploadPayload } from "@/lib/appsScriptApi";
import type { CmsEvent, CmsStatus, EventPhoto } from "@/types/cms";
import { SmartImage } from "@/components/UI/SmartImage";

const emptyEvent = {
  TITLE: "",
  SHORT_DESCRIPTION: "",
  DESCRIPTION: "",
  EVENT_DATE: "",
  END_DATE: "",
  EVENT_TIME: "",
  LOCATION: "",
  ACADEMIC_YEAR: "",
  STATUS: "DRAFT" as CmsStatus
};

type AdminEventFormProps = {
  eventId?: string;
};

export function AdminEventForm({ eventId }: AdminEventFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(emptyEvent);
  const [files, setFiles] = useState<File[]>([]);
  const [events, setEvents] = useState<CmsEvent[]>([]);
  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [message, setMessage] = useState(eventId ? "Loading event..." : "");
  const [saving, setSaving] = useState(false);

  const currentEvent = useMemo(
    () => events.find((event) => event.EVENT_ID === eventId),
    [eventId, events]
  );

  useEffect(() => {
    if (!eventId) {
      return;
    }

    cmsApi.getAllEvents().then(async (response) => {
      if (!response.success) {
        setMessage(response.message);
        return;
      }

      const loadedEvents = response.data?.events ?? [];
      setEvents(loadedEvents);
      const event = loadedEvents.find((item) => item.EVENT_ID === eventId);

      if (!event) {
        setMessage("Event not found.");
        return;
      }

      setForm({
        TITLE: event.TITLE,
        SHORT_DESCRIPTION: event.SHORT_DESCRIPTION,
        DESCRIPTION: event.DESCRIPTION,
        EVENT_DATE: event.EVENT_DATE,
        END_DATE: event.END_DATE,
        EVENT_TIME: event.EVENT_TIME,
        LOCATION: event.LOCATION,
        ACADEMIC_YEAR: event.ACADEMIC_YEAR,
        STATUS: event.STATUS
      });
      setMessage("");

      const photosResponse = await cmsApi.getEventPhotos(event.EVENT_ID);
      if (photosResponse.success) {
        setPhotos(photosResponse.data?.photos ?? []);
      }
    });
  }, [eventId]);

  function updateField(name: keyof typeof emptyEvent, value: string) {
    setForm((current) => ({ ...current, [name]: value }) as typeof emptyEvent);
  }

  async function refreshPhotos() {
    if (!eventId) {
      return;
    }
    const response = await cmsApi.getEventPhotos(eventId);
    if (response.success) {
      setPhotos(response.data?.photos ?? []);
    }
  }

  async function saveEvent(status?: CmsStatus) {
    if (!form.TITLE.trim() || !form.DESCRIPTION.trim() || !form.EVENT_DATE) {
      setMessage("Title, description, and event date are required.");
      return;
    }

    setSaving(true);
    setMessage("");

    const payload = { ...form, STATUS: status ?? form.STATUS };
    const response = eventId
      ? await cmsApi.updateEvent(eventId, payload)
      : await cmsApi.createEvent(payload);

    if (!response.success || !response.data?.event) {
      setMessage(response.message);
      setSaving(false);
      return;
    }

    if (files.length) {
      const uploadFiles = await Promise.all(files.map(fileToUploadPayload));
      const uploadResponse = await cmsApi.uploadEventPhotos(
        response.data.event.EVENT_ID,
        uploadFiles
      );

      if (!uploadResponse.success) {
        setMessage(uploadResponse.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    router.push("/admin/events");
  }

  async function updatePhoto(photoId: string, updates: Partial<EventPhoto>) {
    setSaving(true);
    const response = await cmsApi.updateEventPhoto(photoId, updates);
    setMessage(response.message);
    setSaving(false);
    await refreshPhotos();
  }

  async function setCover(photoId: string) {
    if (!eventId) {
      return;
    }

    setSaving(true);
    const response = await cmsApi.setEventCoverPhoto(eventId, photoId);
    setMessage(response.message);
    setSaving(false);
    await refreshPhotos();
  }

  async function permanentDelete() {
    if (!currentEvent) {
      return;
    }

    const typed = window.prompt(
      `Type the event title to permanently delete this historical record: ${currentEvent.TITLE}`
    );

    if (typed !== currentEvent.TITLE) {
      setMessage("Permanent delete cancelled.");
      return;
    }

    setSaving(true);
    const response = await cmsApi.deleteEvent(currentEvent.EVENT_ID, typed);
    setMessage(response.message);
    setSaving(false);

    if (response.success) {
      router.push("/admin/events");
    }
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
          {eventId ? "Edit Event" : "Add Event"}
        </p>
        <h2 className="mt-2 text-3xl font-bold text-navy">
          {eventId ? form.TITLE || "Edit event" : "Create permanent event record"}
        </h2>

        <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-navy">
          Title *
          <input
            value={form.TITLE}
            onChange={(event) => updateField("TITLE", event.target.value)}
            className="focus-ring rounded-md border border-slate-200 px-3 py-3"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-navy">
          Short description
          <input
            value={form.SHORT_DESCRIPTION}
            onChange={(event) =>
              updateField("SHORT_DESCRIPTION", event.target.value)
            }
            className="focus-ring rounded-md border border-slate-200 px-3 py-3"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-navy">
          Description *
          <textarea
            value={form.DESCRIPTION}
            onChange={(event) => updateField("DESCRIPTION", event.target.value)}
            rows={6}
            className="focus-ring rounded-md border border-slate-200 px-3 py-3"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-navy">
            Event date *
            <input
              type="date"
              value={form.EVENT_DATE}
              onChange={(event) => updateField("EVENT_DATE", event.target.value)}
              className="focus-ring rounded-md border border-slate-200 px-3 py-3"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-navy">
            End date
            <input
              type="date"
              value={form.END_DATE}
              onChange={(event) => updateField("END_DATE", event.target.value)}
              className="focus-ring rounded-md border border-slate-200 px-3 py-3"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-navy">
            Event time
            <input
              type="time"
              value={form.EVENT_TIME}
              onChange={(event) => updateField("EVENT_TIME", event.target.value)}
              className="focus-ring rounded-md border border-slate-200 px-3 py-3"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-navy">
            Academic year
            <input
              value={form.ACADEMIC_YEAR}
              onChange={(event) =>
                updateField("ACADEMIC_YEAR", event.target.value)
              }
              placeholder="2026-27"
              className="focus-ring rounded-md border border-slate-200 px-3 py-3"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-navy">
          Location
          <input
            value={form.LOCATION}
            onChange={(event) => updateField("LOCATION", event.target.value)}
            className="focus-ring rounded-md border border-slate-200 px-3 py-3"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-navy">
          Publish status
          <select
            value={form.STATUS}
            onChange={(event) => updateField("STATUS", event.target.value)}
            className="focus-ring rounded-md border border-slate-200 px-3 py-3"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-navy">
          Add event photographs
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) =>
              setFiles(Array.from(event.target.files ?? []).slice(0, 25))
            }
            className="focus-ring rounded-md border border-slate-200 px-3 py-3"
          />
          {files.length ? (
            <span className="text-sm text-slate-500">
              {files.length} photograph(s) selected. They will be appended to
              the event gallery.
            </span>
          ) : null}
        </label>
        </div>

        {message ? (
          <p className="mt-5 rounded-md bg-gold/10 p-3 text-sm text-navy">
            {message}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => saveEvent("DRAFT")}
          className="focus-ring rounded-md border border-navy px-5 py-3 text-sm font-bold text-navy disabled:opacity-60"
        >
          Save Draft
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => saveEvent("PUBLISHED")}
          className="focus-ring rounded-md bg-navy px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          Publish
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/events")}
          className="focus-ring rounded-md bg-slate-100 px-5 py-3 text-sm font-bold text-navy"
        >
          Cancel
        </button>
        {eventId ? (
          <button
            type="button"
            disabled={saving}
            onClick={permanentDelete}
            className="focus-ring ml-auto rounded-md border border-red-200 px-5 py-3 text-sm font-bold text-red-700 disabled:opacity-60"
          >
            Permanent Delete
          </button>
        ) : null}
        </div>
      </div>

      {eventId ? (
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
                Event Photo Archive
              </p>
              <h3 className="mt-2 text-2xl font-bold text-navy">
                Captions, names, order, and cover photo
              </h3>
            </div>
            <p className="text-sm leading-6 text-slate-500">
              Uploaded photographs stay in the event folder permanently unless a
              SUPER_ADMIN permanently deletes the full event record.
            </p>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {photos.length ? (
              photos
                .slice()
                .sort((a, b) => Number(a.DISPLAY_ORDER) - Number(b.DISPLAY_ORDER))
                .map((photo) => (
                  <EventPhotoEditor
                    key={photo.PHOTO_ID}
                    photo={photo}
                    saving={saving}
                    onSave={updatePhoto}
                    onCover={setCover}
                  />
                ))
            ) : (
              <div className="rounded-lg border border-slate-200 p-5 text-slate-600 md:col-span-2">
                No event photographs uploaded yet.
              </div>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function EventPhotoEditor({
  photo,
  saving,
  onSave,
  onCover
}: {
  photo: EventPhoto;
  saving: boolean;
  onSave: (photoId: string, updates: Partial<EventPhoto>) => Promise<void>;
  onCover: (photoId: string) => Promise<void>;
}) {
  const [caption, setCaption] = useState(photo.CAPTION);
  const [personNames, setPersonNames] = useState(photo.PERSON_NAMES);
  const [altText, setAltText] = useState(photo.ALT_TEXT);
  const [displayOrder, setDisplayOrder] = useState(String(photo.DISPLAY_ORDER || ""));
  const isCover = photo.IS_COVER === true || photo.IS_COVER === "TRUE";

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200">
      <div className="relative">
        <SmartImage
          src={photo.IMAGE_URL}
          alt={photo.ALT_TEXT || photo.CAPTION || "Event photograph"}
          fallbackLabel="Photo"
          className="aspect-[3/2] w-full object-cover"
        />
        {isCover ? (
          <span className="absolute left-3 top-3 rounded bg-gold px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-navy">
            Cover
          </span>
        ) : null}
      </div>
      <div className="grid gap-3 p-4">
        <input
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="Caption"
          className="focus-ring rounded-md border border-slate-200 px-3 py-2"
        />
        <input
          value={personNames}
          onChange={(event) => setPersonNames(event.target.value)}
          placeholder="Optional names"
          className="focus-ring rounded-md border border-slate-200 px-3 py-2"
        />
        <input
          value={altText}
          onChange={(event) => setAltText(event.target.value)}
          placeholder="Alternative text"
          className="focus-ring rounded-md border border-slate-200 px-3 py-2"
        />
        <input
          value={displayOrder}
          onChange={(event) => setDisplayOrder(event.target.value)}
          placeholder="Display order"
          className="focus-ring rounded-md border border-slate-200 px-3 py-2"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() =>
              onSave(photo.PHOTO_ID, {
                CAPTION: caption,
                PERSON_NAMES: personNames,
                ALT_TEXT: altText,
                DISPLAY_ORDER: displayOrder
              })
            }
            className="focus-ring rounded-md bg-navy px-3 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            Update Caption
          </button>
          <button
            type="button"
            disabled={saving || isCover}
            onClick={() => onCover(photo.PHOTO_ID)}
            className="focus-ring rounded-md border border-navy px-3 py-2 text-sm font-bold text-navy disabled:opacity-60"
          >
            Set as Cover
          </button>
        </div>
      </div>
    </article>
  );
}
