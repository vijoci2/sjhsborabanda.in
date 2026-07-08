import { events, galleryItems, newsItems } from "@/lib/data";
import type { CmsEvent, GalleryAlbum, GalleryPhoto } from "@/types/cms";

function toIsoDate(yearlessDate: string, index: number) {
  const currentYear = new Date().getFullYear();
  const parsed = new Date(`${yearlessDate} ${currentYear}`);

  if (Number.isNaN(parsed.getTime())) {
    return newsItems[index]?.date ?? `${currentYear}-07-${String(index + 1).padStart(2, "0")}`;
  }

  return parsed.toISOString().slice(0, 10);
}

export const fallbackEvents: CmsEvent[] = events.map((event, index) => ({
  EVENT_ID: `LOCAL-EVENT-${index + 1}`,
  TITLE: event.title,
  SLUG: event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  SHORT_DESCRIPTION: event.description,
  DESCRIPTION: event.description,
  EVENT_DATE: toIsoDate(event.date, index),
  END_DATE: "",
  EVENT_TIME: "",
  LOCATION: "St. Joseph's High School Campus",
  EVENT_FOLDER_ID: "",
  COVER_PHOTO_ID: "",
  COVER_PHOTO_URL: "/images/gallery/annual-day.jpg",
  STATUS: "PUBLISHED",
  ACADEMIC_YEAR: "2026-27",
  CREATED_BY: "SYSTEM",
  CREATED_AT: "",
  UPDATED_AT: "",
  PHOTO_COUNT: 0
}));

export const fallbackAlbums: GalleryAlbum[] = [
  {
    ALBUM_ID: "LOCAL-ALBUM-CAMPUS",
    TITLE: "Campus Life",
    SLUG: "campus-life",
    DESCRIPTION:
      "A public album of school building views, classrooms, activities, and learning spaces.",
    ALBUM_DATE: "2026-07-01",
    LOCATION: "Borabanda, Hyderabad",
    DRIVE_FOLDER_URL: "",
    ALBUM_FOLDER_ID: "",
    COVER_PHOTO_ID: "LOCAL-PHOTO-1",
    COVER_PHOTO_URL: "/images/campus.jpg",
    STATUS: "PUBLISHED",
    CREATED_BY: "SYSTEM",
    CREATED_AT: "",
    UPDATED_AT: "",
    PHOTO_COUNT: galleryItems.length
  }
];

export const fallbackGalleryPhotos: GalleryPhoto[] = galleryItems.map((item, index) => ({
  PHOTO_ID: `LOCAL-PHOTO-${index + 1}`,
  ALBUM_ID: "LOCAL-ALBUM-CAMPUS",
  DRIVE_FILE_ID: "",
  DRIVE_FOLDER_ID: "",
  FILE_NAME: item.image.split("/").pop() ?? `photo-${index + 1}.jpg`,
  MIME_TYPE: "image/jpeg",
  IMAGE_URL: item.image,
  THUMBNAIL_URL: item.image,
  CAPTION: item.title,
  PERSON_NAMES: "",
  ALT_TEXT: `${item.title} - ${item.category}`,
  DISPLAY_ORDER: index + 1,
  CREATED_BY: "SYSTEM",
  CREATED_AT: "",
  UPDATED_AT: ""
}));

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
