import type { CmsEvent, GalleryAlbum, GalleryPhoto } from "@/types/cms";

export const fallbackEvents: CmsEvent[] = [];

export const fallbackAlbums: GalleryAlbum[] = [];

export const fallbackGalleryPhotos: GalleryPhoto[] = [];

export function formatCmsDate(date: string) {
  if (!date) {
    return "Date to be announced";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function isPastEvent(event: CmsEvent) {
  if (!event.EVENT_DATE) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(event.EVENT_DATE);
  eventDate.setHours(0, 0, 0, 0);
  return eventDate < today;
}

export function isTodayEvent(event: CmsEvent) {
  if (!event.EVENT_DATE) {
    return false;
  }

  const today = new Date();
  const eventDate = new Date(event.EVENT_DATE);
  return (
    eventDate.getFullYear() === today.getFullYear() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getDate() === today.getDate()
  );
}
