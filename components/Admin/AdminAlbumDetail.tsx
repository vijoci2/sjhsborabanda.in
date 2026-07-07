"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cmsApi, fileToUploadPayload } from "@/lib/appsScriptApi";
import { formatCmsDate } from "@/lib/cmsFallback";
import type { GalleryAlbum, GalleryPhoto } from "@/types/cms";
import { AdminAlbumForm } from "@/components/Admin/AdminAlbumForm";
import { SmartImage } from "@/components/UI/SmartImage";

export function AdminAlbumDetail({ albumId }: { albumId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [album, setAlbum] = useState<GalleryAlbum | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("Loading album...");
  const [saving, setSaving] = useState(false);

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
    setPhotos(photosResponse.success ? photosResponse.data?.photos ?? [] : []);
    setMessage("");
  }

  useEffect(() => {
    loadAlbum();
  }, [albumId]);

  async function uploadPhotos() {
    if (!files.length) {
      setMessage("Choose photographs first.");
      return;
    }

    setSaving(true);
    const payload = await Promise.all(files.map(fileToUploadPayload));
    const response = await cmsApi.uploadGalleryPhotos(albumId, payload);
    setMessage(response.message);
    setFiles([]);
    setSaving(false);
    await loadAlbum();
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
          <p className="mt-2 leading-7 text-slate-600">
            {formatCmsDate(album.ALBUM_DATE)} - {album.LOCATION}
          </p>
        ) : null}
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-2xl font-bold text-navy">Upload Photos</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Upload up to 25 images per batch. Captions and names can be edited
          after upload.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) =>
              setFiles(Array.from(event.target.files ?? []).slice(0, 25))
            }
            className="focus-ring rounded-md border border-slate-200 px-3 py-3"
          />
          <button
            type="button"
            disabled={saving || !files.length}
            onClick={uploadPhotos}
            className="focus-ring rounded-md bg-navy px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white disabled:opacity-60"
          >
            Upload Photos
          </button>
        </div>
      </div>

      {message ? (
        <div className="rounded-lg border border-gold/30 bg-gold/10 p-4 text-sm text-navy">
          {message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        {photos.length ? (
          photos
            .slice()
            .sort((a, b) => Number(a.DISPLAY_ORDER) - Number(b.DISPLAY_ORDER))
            .map((photo) => (
              <PhotoEditor
                key={photo.PHOTO_ID}
                photo={photo}
                saving={saving}
                onSave={updatePhoto}
                onDelete={deletePhoto}
                onCover={setCover}
              />
            ))
        ) : (
          <div className="rounded-lg bg-white p-6 text-center text-slate-600 shadow-sm">
            No photographs uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoEditor({
  photo,
  saving,
  onSave,
  onDelete,
  onCover
}: {
  photo: GalleryPhoto;
  saving: boolean;
  onSave: (photoId: string, updates: Partial<GalleryPhoto>) => Promise<void>;
  onDelete: (photoId: string) => Promise<void>;
  onCover: (photoId: string) => Promise<void>;
}) {
  const [caption, setCaption] = useState(photo.CAPTION);
  const [personNames, setPersonNames] = useState(photo.PERSON_NAMES);
  const [altText, setAltText] = useState(photo.ALT_TEXT);
  const [displayOrder, setDisplayOrder] = useState(String(photo.DISPLAY_ORDER || ""));

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-sm">
      <SmartImage
        src={photo.IMAGE_URL}
        alt={photo.ALT_TEXT || photo.CAPTION || "Gallery photograph"}
        fallbackLabel="Photo"
        className="aspect-[3/2] w-full object-cover"
      />
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
