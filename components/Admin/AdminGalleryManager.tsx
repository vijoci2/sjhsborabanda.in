"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cmsApi } from "@/lib/appsScriptApi";
import { formatCmsDate } from "@/lib/cmsFallback";
import type { GalleryAlbum } from "@/types/cms";

export function AdminGalleryManager() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("Loading albums...");
  const [savingId, setSavingId] = useState("");

  async function loadAlbums() {
    const response = await cmsApi.getAllAlbums();
    if (response.success) {
      setAlbums(response.data?.albums ?? []);
      setMessage("");
    } else {
      setMessage(response.message);
    }
  }

  useEffect(() => {
    loadAlbums();
  }, []);

  const visibleAlbums = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    return albums
      .filter((album) =>
        cleanQuery
          ? `${album.TITLE} ${album.LOCATION} ${album.DESCRIPTION} ${album.DRIVE_FOLDER_URL || ""}`
              .toLowerCase()
              .includes(cleanQuery)
          : true
      )
      .sort((a, b) => b.ALBUM_DATE.localeCompare(a.ALBUM_DATE));
  }, [albums, query]);

  async function runAction(
    albumId: string,
    label: string,
    action: () => Promise<{ success: boolean; message: string }>
  ) {
    if (!window.confirm(`${label} this album?`)) {
      return;
    }

    setSavingId(albumId);
    const response = await action();
    setMessage(response.message);
    setSavingId("");
    await loadAlbums();
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
            Gallery
          </p>
          <h2 className="mt-2 text-3xl font-bold text-navy">Albums</h2>
          <p className="mt-2 max-w-2xl leading-7 text-slate-600">
            Create albums, upload photographs, edit captions, and choose cover
            photos for the public gallery.
          </p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="focus-ring rounded-md bg-navy px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.12em] text-white"
        >
          Add Album
        </Link>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search albums"
          className="focus-ring w-full rounded-md border border-slate-200 px-3 py-3"
        />
      </div>

      {message ? (
        <div className="rounded-lg border border-gold/30 bg-gold/10 p-4 text-sm text-navy">
          {message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        {visibleAlbums.length ? (
          visibleAlbums.map((album) => (
            <article key={album.ALBUM_ID} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                <span className="rounded bg-navy px-2 py-1 text-white">
                  {album.STATUS}
                </span>
                <span className="rounded bg-gold/20 px-2 py-1 text-navy">
                  {formatCmsDate(album.ALBUM_DATE)}
                </span>
              </div>
              <h3 className="mt-3 text-2xl font-bold text-navy">{album.TITLE}</h3>
              <p className="mt-3 leading-7 text-slate-600">{album.DESCRIPTION}</p>
              <p className="mt-2 text-sm text-slate-500">
                {album.LOCATION} {album.PHOTO_COUNT ? `- ${album.PHOTO_COUNT} photos` : ""}
              </p>
              {album.DRIVE_FOLDER_URL ? (
                <a
                  href={album.DRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex text-sm font-bold text-navy underline decoration-gold decoration-2 underline-offset-4"
                >
                  Open shared album
                </a>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/admin/gallery/${album.ALBUM_ID}`}
                  className="focus-ring rounded-md border border-navy px-3 py-2 text-sm font-bold text-navy"
                >
                  Manage Photos
                </Link>
                <Link
                  href={`/admin/gallery/${album.ALBUM_ID}?edit=1`}
                  className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-navy"
                >
                  Edit
                </Link>
                {album.STATUS === "PUBLISHED" ? (
                  <button
                    type="button"
                    disabled={savingId === album.ALBUM_ID}
                    onClick={() =>
                      runAction(album.ALBUM_ID, "Unpublish", () =>
                        cmsApi.unpublishAlbum(album.ALBUM_ID)
                      )
                    }
                    className="focus-ring rounded-md bg-gold px-3 py-2 text-sm font-bold text-navy"
                  >
                    Unpublish
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={savingId === album.ALBUM_ID}
                    onClick={() =>
                      runAction(album.ALBUM_ID, "Publish", () =>
                        cmsApi.publishAlbum(album.ALBUM_ID)
                      )
                    }
                    className="focus-ring rounded-md bg-navy px-3 py-2 text-sm font-bold text-white"
                  >
                    Publish
                  </button>
                )}
                <button
                  type="button"
                  disabled={savingId === album.ALBUM_ID}
                  onClick={() =>
                    runAction(album.ALBUM_ID, "Delete album and all photographs", () =>
                      cmsApi.deleteAlbum(album.ALBUM_ID)
                    )
                  }
                  className="focus-ring rounded-md border border-red-200 px-3 py-2 text-sm font-bold text-red-700"
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-lg bg-white p-6 text-center text-slate-600 shadow-sm">
            No gallery albums yet.
          </div>
        )}
      </div>
    </div>
  );
}
