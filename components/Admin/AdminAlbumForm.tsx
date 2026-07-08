"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cmsApi } from "@/lib/appsScriptApi";
import type { CmsStatus, GalleryAlbum } from "@/types/cms";

const emptyAlbum = {
  TITLE: "",
  DESCRIPTION: "",
  ALBUM_DATE: "",
  LOCATION: "",
  DRIVE_FOLDER_URL: "",
  STATUS: "DRAFT" as CmsStatus
};

type AdminAlbumFormProps = {
  albumId?: string;
};

export function AdminAlbumForm({ albumId }: AdminAlbumFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(emptyAlbum);
  const [message, setMessage] = useState(albumId ? "Loading album..." : "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!albumId) {
      return;
    }

    cmsApi.getAllAlbums().then((response) => {
      if (!response.success) {
        setMessage(response.message);
        return;
      }

      const album = (response.data?.albums ?? []).find(
        (item: GalleryAlbum) => item.ALBUM_ID === albumId
      );

      if (!album) {
        setMessage("Album not found.");
        return;
      }

      setForm({
        TITLE: album.TITLE,
        DESCRIPTION: album.DESCRIPTION,
        ALBUM_DATE: album.ALBUM_DATE,
        LOCATION: album.LOCATION,
        DRIVE_FOLDER_URL: album.DRIVE_FOLDER_URL || "",
        STATUS: album.STATUS
      });
      setMessage("");
    });
  }, [albumId]);

  function updateField(name: keyof typeof emptyAlbum, value: string) {
    setForm((current) => ({ ...current, [name]: value }) as typeof emptyAlbum);
  }

  async function saveAlbum(status?: CmsStatus) {
    if (!form.TITLE.trim() || !form.ALBUM_DATE) {
      setMessage("Album title and date are required.");
      return;
    }

    setSaving(true);
    const payload = { ...form, STATUS: status ?? form.STATUS };
    const response = albumId
      ? await cmsApi.updateAlbum(albumId, payload)
      : await cmsApi.createAlbum(payload);

    if (!response.success) {
      setMessage(response.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    router.push(
      response.data?.album
        ? `/admin/gallery/${response.data.album.ALBUM_ID}`
        : "/admin/gallery"
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
        {albumId ? "Edit Album" : "Add Album"}
      </p>
      <h2 className="mt-2 text-3xl font-bold text-navy">
        {albumId ? form.TITLE || "Edit album" : "Create gallery album"}
      </h2>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-navy">
          Album title *
          <input
            value={form.TITLE}
            onChange={(event) => updateField("TITLE", event.target.value)}
            className="focus-ring rounded-md border border-slate-200 px-3 py-3"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-navy">
          Description
          <textarea
            value={form.DESCRIPTION}
            onChange={(event) => updateField("DESCRIPTION", event.target.value)}
            rows={5}
            className="focus-ring rounded-md border border-slate-200 px-3 py-3"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-navy">
            Album date *
            <input
              type="date"
              value={form.ALBUM_DATE}
              onChange={(event) => updateField("ALBUM_DATE", event.target.value)}
              className="focus-ring rounded-md border border-slate-200 px-3 py-3"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-navy">
            Status
            <select
              value={form.STATUS}
              onChange={(event) => updateField("STATUS", event.target.value)}
              className="focus-ring rounded-md border border-slate-200 px-3 py-3"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </label>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-navy">
          Location / place
          <input
            value={form.LOCATION}
            onChange={(event) => updateField("LOCATION", event.target.value)}
            placeholder="Example: St. Joseph's High School, Borabanda"
            className="focus-ring rounded-md border border-slate-200 px-3 py-3"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-navy">
          Google Drive / Google Photos link
          <input
            type="url"
            value={form.DRIVE_FOLDER_URL}
            onChange={(event) => updateField("DRIVE_FOLDER_URL", event.target.value)}
            placeholder="Paste the public Drive or Google Photos album link here"
            className="focus-ring rounded-md border border-slate-200 px-3 py-3"
          />
          <span className="text-xs font-medium leading-5 text-slate-500">
            Set sharing to "Anyone with the link - Viewer". This keeps GitHub
            small and gives visitors a full album link.
          </span>
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
          onClick={() => saveAlbum("DRAFT")}
          className="focus-ring rounded-md border border-navy px-5 py-3 text-sm font-bold text-navy disabled:opacity-60"
        >
          Save Draft
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => saveAlbum("PUBLISHED")}
          className="focus-ring rounded-md bg-navy px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          Publish
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/gallery")}
          className="focus-ring rounded-md bg-slate-100 px-5 py-3 text-sm font-bold text-navy"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
