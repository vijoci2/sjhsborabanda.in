"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cmsApi } from "@/lib/appsScriptApi";
import { formatCmsDate } from "@/lib/cmsFallback";
import type { GalleryAlbum, GalleryPhoto, PhotoPage } from "@/types/cms";
import { AdminAlbumForm } from "@/components/Admin/AdminAlbumForm";
import { SmartImage } from "@/components/UI/SmartImage";

function extractSharedAlbumUrl(value: string) {
  return value.trim().match(/https:\/\/[^\s)\]]+/i)?.[0] ?? value.trim();
}

export function AdminAlbumDetail({ albumId }: { albumId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [album, setAlbum] = useState<GalleryAlbum | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [photoPage, setPhotoPage] = useState<PhotoPage | null>(null);
  const [shareLink, setShareLink] = useState("");
  const [message, setMessage] = useState("Loading album...");
  const [saving, setSaving] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const editing = searchParams.get("edit") === "1";

  async function loadAlbum() {
    const albumResponse = await cmsApi.getAllAlbums();
    if (!albumResponse.success) {
      setMessage(albumResponse.message);
      return;
    }

    const foundAlbum = (albumResponse.data?.albums ?? []).find(
      (item) => item.ALBUM_ID === albumId
    );

    if (!foundAlbum) {
      setMessage("Album not found.");
      return;
    }

    const photosResponse = await cmsApi.getAlbumPhotos(albumId);
    setAlbum(foundAlbum);
    setShareLink(foundAlbum.DRIVE_FOLDER_URL || "");
    setPhotos(photosResponse.success ? photosResponse.data?.photos ?? [] : []);
    setPhotoPage(photosResponse.success ? photosResponse.data?.photoPage ?? null : null);
    setMessage("");
  }

  useEffect(() => {
    loadAlbum();
  }, [albumId]);

  const orderedPhotos = useMemo(
    () =>
      photos
        .slice()
        .sort((a, b) => Number(a.DISPLAY_ORDER) - Number(b.DISPLAY_ORDER)),
    [photos]
  );

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (activeIndex === null || !orderedPhotos.length) {
        return;
      }

      if (event.key === "Escape") {
        setActiveIndex(null);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((activeIndex + 1) % orderedPhotos.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((activeIndex - 1 + orderedPhotos.length) % orderedPhotos.length);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, orderedPhotos.length]);

  async function saveShareLink() {
    const cleanLink = extractSharedAlbumUrl(shareLink);
    const isAllowedLink =
      !cleanLink ||
      /^https:\/\/drive\.google\.com\//i.test(cleanLink) ||
      /^https:\/\/docs\.google\.com\//i.test(cleanLink) ||
      /^https:\/\/photos\.app\.goo\.gl\//i.test(cleanLink) ||
      /^https:\/\/photos\.google\.com\//i.test(cleanLink) ||
      /^https:\/\/share\.google\//i.test(cleanLink);

    if (!isAllowedLink) {
      setMessage("Paste a Google Drive or Google Photos public sharing link.");
      return;
    }

    setSaving(true);
    const response = await cmsApi.updateAlbum(albumId, {
      DRIVE_FOLDER_URL: cleanLink
    });
    if (response.success) {
      const savedLink = response.data?.album?.DRIVE_FOLDER_URL || "";
      if (cleanLink && savedLink !== cleanLink) {
        setMessage(
          "The link was submitted, but it was not saved in the Sheet. Paste the latest Code.gs, deploy a new Apps Script version, then try again."
        );
      } else {
        setMessage(cleanLink ? "Shared album link saved." : "Shared album link removed.");
      }
    } else {
      setMessage(response.message);
    }
    setSaving(false);
    await loadAlbum();
  }

  async function loadMorePhotos() {
    if (!photoPage?.hasMore || loadingMore) {
      return;
    }

    setLoadingMore(true);
    const response = await cmsApi.getAlbumPhotos(albumId, {
      offset: photoPage.nextOffset,
      pageSize: photoPage.pageSize
    });
    if (response.success) {
      setPhotos((currentPhotos) => [
        ...currentPhotos,
        ...(response.data?.photos ?? [])
      ]);
      setPhotoPage(response.data?.photoPage ?? null);
      setMessage("");
    } else {
      setMessage(response.message);
    }
    setLoadingMore(false);
  }

  async function updatePhoto(photoId: string, updates: Partial<GalleryPhoto>) {
    setSaving(true);
    const response = await cmsApi.updateGalleryPhoto(photoId, updates);
    setMessage(response.message);
    setSaving(false);
    await loadAlbum();
  }

  async function deletePhoto(photoId: string) {
    if (!window.confirm("Delete this photograph? This action cannot be undone.")) {
      return;
    }

    setSaving(true);
    const response = await cmsApi.deleteGalleryPhoto(photoId);
    setMessage(response.message);
    setSaving(false);
    await loadAlbum();
  }

  async function setCover(photoId: string) {
    setSaving(true);
    const response = await cmsApi.setAlbumCover(albumId, photoId);
    setMessage(response.message);
    setSaving(false);
    await loadAlbum();
  }

  if (editing) {
    return <AdminAlbumForm albumId={albumId} />;
  }

  const activePhoto = activeIndex !== null ? orderedPhotos[activeIndex] : null;
  const currentIndex = activeIndex ?? 0;

  return (
    <div className="grid gap-6">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <button
          type="button"
          onClick={() => router.push("/admin/gallery")}
          className="focus-ring mb-4 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-navy"
        >
          Back to albums
        </button>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
          Album Photos
        </p>
        <h2 className="mt-2 text-3xl font-bold text-navy">
          {album?.TITLE ?? "Gallery album"}
        </h2>
        {album ? (
          <div className="mt-2 grid gap-2 leading-7 text-slate-600">
            <p>
              {formatCmsDate(album.ALBUM_DATE)} - {album.LOCATION}
            </p>
            {album.DRIVE_FOLDER_URL ? (
              <a
                href={album.DRIVE_FOLDER_URL}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-navy underline decoration-gold decoration-2 underline-offset-4"
              >
                Open shared photo album
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-bold text-navy">Shared Photo Album Link</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Paste a public Google Drive folder link or Google Photos shared album
          link. Set sharing to anyone with the link, then submit.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            type="url"
            value={shareLink}
            onChange={(event) => setShareLink(event.target.value)}
            placeholder="https://drive.google.com/drive/folders/..."
            className="focus-ring rounded-md border border-slate-200 px-3 py-3"
          />
          <button
            type="button"
            disabled={saving}
            onClick={saveShareLink}
            className="focus-ring rounded-md bg-navy px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white disabled:opacity-60"
          >
            Submit Link
          </button>
        </div>
        <p className="mt-3 text-xs font-medium leading-5 text-slate-500">
          Example: https://drive.google.com/drive/folders/1n06TWEqrqNcnWRtHZ8tCEjZak9vXayRJ
        </p>
      </div>

      {message ? (
        <div className="rounded-lg border border-gold/30 bg-gold/10 p-4 text-sm text-navy">
          {message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        {orderedPhotos.length ? (
          orderedPhotos
            .map((photo, index) => (
              photo.SOURCE_TYPE === "SHARED_LINK" ? (
                <LinkedPhotoPreview
                  key={photo.PHOTO_ID}
                  photo={photo}
                  onOpen={() => setActiveIndex(index)}
                />
              ) : (
                <PhotoEditor
                  key={photo.PHOTO_ID}
                  photo={photo}
                  saving={saving}
                  onSave={updatePhoto}
                  onDelete={deletePhoto}
                  onCover={setCover}
                  onOpen={() => setActiveIndex(index)}
                />
              )
            ))
        ) : (
          <div className="rounded-lg bg-white p-6 text-center text-slate-600 shadow-sm">
            {album?.DRIVE_FOLDER_URL
              ? "No images could be read from this shared link yet. Check that the Drive folder is public, or use the original shared album link."
            : "Paste a shared photo album link above and submit."}
          </div>
        )}
      </div>

      {photoPage ? (
        <div className="flex flex-col items-center gap-3 rounded-lg bg-white p-5 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Showing {orderedPhotos.length} of {photoPage.totalCount} photos
          </p>
          {photoPage.hasMore ? (
            <button
              type="button"
              disabled={loadingMore}
              onClick={loadMorePhotos}
              className="focus-ring rounded-md bg-navy px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white disabled:opacity-60"
            >
              {loadingMore ? "Loading..." : "Load More Photos"}
            </button>
          ) : null}
        </div>
      ) : null}

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
              alt={activePhoto.ALT_TEXT || activePhoto.CAPTION || album?.TITLE || "Photo"}
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
                {activePhoto.CAPTION || activePhoto.FILE_NAME}
                <span className="block text-white/70">
                  {currentIndex + 1} of {orderedPhotos.length}
                </span>
              </p>
              <button
                type="button"
                onClick={() => setActiveIndex((currentIndex + 1) % orderedPhotos.length)}
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

function LinkedPhotoPreview({
  photo,
  onOpen
}: {
  photo: GalleryPhoto;
  onOpen: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-sm">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <SmartImage
          src={photo.THUMBNAIL_URL || photo.IMAGE_URL}
          alt={photo.ALT_TEXT || "Linked gallery photograph"}
          fallbackLabel="Linked Photo"
          className="aspect-[3/2] w-full object-cover"
        />
      </button>
      <div className="grid gap-2 p-4">
        <p className="text-sm font-bold text-navy">{photo.FILE_NAME}</p>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Linked from shared album
        </p>
      </div>
    </article>
  );
}

function PhotoEditor({
  photo,
  saving,
  onSave,
  onDelete,
  onCover,
  onOpen
}: {
  photo: GalleryPhoto;
  saving: boolean;
  onSave: (photoId: string, updates: Partial<GalleryPhoto>) => Promise<void>;
  onDelete: (photoId: string) => Promise<void>;
  onCover: (photoId: string) => Promise<void>;
  onOpen: () => void;
}) {
  const [caption, setCaption] = useState(photo.CAPTION);
  const [personNames, setPersonNames] = useState(photo.PERSON_NAMES);
  const [altText, setAltText] = useState(photo.ALT_TEXT);
  const [displayOrder, setDisplayOrder] = useState(String(photo.DISPLAY_ORDER || ""));

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-sm">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <SmartImage
          src={photo.IMAGE_URL}
          alt={photo.ALT_TEXT || photo.CAPTION || "Gallery photograph"}
          fallbackLabel="Photo"
          className="aspect-[3/2] w-full object-cover"
        />
      </button>
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
            disabled={saving}
            onClick={() => onCover(photo.PHOTO_ID)}
            className="focus-ring rounded-md border border-navy px-3 py-2 text-sm font-bold text-navy"
          >
            Set as Cover
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => onDelete(photo.PHOTO_ID)}
            className="focus-ring rounded-md border border-red-200 px-3 py-2 text-sm font-bold text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
