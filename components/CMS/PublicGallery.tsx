"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cmsApi } from "@/lib/appsScriptApi";
import {
  fallbackAlbums,
  fallbackGalleryPhotos,
  formatCmsDate
} from "@/lib/cmsFallback";
import type { GalleryAlbum, GalleryPhoto } from "@/types/cms";
import { SmartImage } from "@/components/UI/SmartImage";

export function PublicGalleryAlbums() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>(fallbackAlbums);
  const [message, setMessage] = useState("");

  useEffect(() => {
    cmsApi.getPublishedAlbums().then((response) => {
      if (response.success && response.data?.albums?.length) {
        setAlbums(response.data.albums);
      } else if (!response.success && response.errorCode !== "CMS_NOT_CONFIGURED") {
        setMessage(response.message);
      }
    });
  }, []);

  return (
    <div className="grid gap-6">
      {message ? (
        <div className="rounded-lg border border-gold/30 bg-gold/10 p-4 text-sm text-navy">
          {message}
        </div>
      ) : null}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <article
            key={album.ALBUM_ID}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lift"
          >
            <SmartImage
              src={album.COVER_PHOTO_URL || "/images/campus.jpg"}
              alt={album.TITLE}
              fallbackLabel="Album"
              className="aspect-[3/2] w-full object-cover"
            />
            <div className="p-5">
              <p className="text-sm font-bold text-gold">
                {formatCmsDate(album.ALBUM_DATE)}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-navy">{album.TITLE}</h2>
              <p className="mt-2 leading-7 text-slate-600">{album.DESCRIPTION}</p>
              <p className="mt-3 text-sm font-semibold text-slate-500">
                {album.PHOTO_COUNT ?? 0} photos
              </p>
              <Link
                href={`/gallery/${album.SLUG}`}
                className="focus-ring mt-5 inline-flex rounded-md bg-navy px-4 py-2 text-sm font-bold text-white"
              >
                View Album
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function PublicGalleryAlbumDetail({ slug }: { slug: string }) {
  const fallbackAlbum = fallbackAlbums.find((album) => album.SLUG === slug);
  const [album, setAlbum] = useState<GalleryAlbum | null>(fallbackAlbum ?? null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>(
    fallbackAlbum ? fallbackGalleryPhotos : []
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [message, setMessage] = useState(fallbackAlbum ? "" : "Loading album...");

  useEffect(() => {
    cmsApi.getAlbumBySlug(slug).then((response) => {
      if (response.success && response.data?.album) {
        setAlbum(response.data.album);
        setPhotos(response.data.photos ?? []);
        setMessage("");
      } else if (!fallbackAlbum) {
        setMessage(response.message);
      }
    });
  }, [fallbackAlbum, slug]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (activeIndex === null) {
        return;
      }

      if (event.key === "Escape") {
        setActiveIndex(null);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((activeIndex + 1) % photos.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((activeIndex - 1 + photos.length) % photos.length);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, photos.length]);

  const orderedPhotos = useMemo(
    () =>
      photos
        .slice()
        .sort((a, b) => Number(a.DISPLAY_ORDER) - Number(b.DISPLAY_ORDER)),
    [photos]
  );

  if (!album) {
    return (
      <div className="rounded-lg bg-white p-6 text-center text-slate-600 shadow-sm">
        {message || "Album not found."}
      </div>
    );
  }

  const activePhoto = activeIndex !== null ? orderedPhotos[activeIndex] : null;
  const currentIndex = activeIndex ?? 0;

  return (
    <div className="grid gap-8">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
          {formatCmsDate(album.ALBUM_DATE)}
        </p>
        <h1 className="mt-3 text-4xl font-bold text-navy">{album.TITLE}</h1>
        <p className="mt-3 text-slate-600">{album.LOCATION}</p>
        <p className="mt-5 leading-8 text-slate-700">{album.DESCRIPTION}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {orderedPhotos.map((photo, index) => (
          <button
            key={photo.PHOTO_ID}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm"
          >
            <SmartImage
              src={photo.THUMBNAIL_URL || photo.IMAGE_URL}
              alt={photo.ALT_TEXT || photo.CAPTION || album.TITLE}
              fallbackLabel="Photo"
              className="aspect-[3/2] w-full object-cover transition duration-500 group-hover:scale-105"
            />
            {photo.CAPTION ? (
              <p className="p-4 text-sm leading-6 text-slate-600">{photo.CAPTION}</p>
            ) : null}
          </button>
        ))}
      </div>

      {activePhoto ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-dark/92 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-h-full w-full max-w-5xl">
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="focus-ring absolute right-0 top-0 z-10 rounded-md bg-white px-3 py-2 text-sm font-bold text-navy"
            >
              Close
            </button>
            <SmartImage
              src={activePhoto.IMAGE_URL}
              alt={activePhoto.ALT_TEXT || activePhoto.CAPTION || album.TITLE}
              fallbackLabel="Photo"
              className="max-h-[82vh] w-full rounded-lg object-contain"
            />
            <div className="mt-3 flex items-center justify-between gap-3 text-white">
              <button
                type="button"
                onClick={() =>
                  setActiveIndex(
                    (currentIndex - 1 + orderedPhotos.length) % orderedPhotos.length
                  )
                }
                className="focus-ring rounded-md border border-white/30 px-3 py-2 text-sm font-bold"
              >
                Previous
              </button>
              <p className="text-center text-sm">
                {activePhoto.CAPTION}
                {activePhoto.PERSON_NAMES ? (
                  <span className="block text-white/70">
                    {activePhoto.PERSON_NAMES}
                  </span>
                ) : null}
              </p>
              <button
                type="button"
                onClick={() =>
                  setActiveIndex((currentIndex + 1) % orderedPhotos.length)
                }
                className="focus-ring rounded-md border border-white/30 px-3 py-2 text-sm font-bold"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
