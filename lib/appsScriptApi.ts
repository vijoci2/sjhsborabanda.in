import type {
  ActivityLogEntry,
  AdminUser,
  ApiResponse,
  CmsEvent,
  GalleryAlbum,
  GalleryPhoto,
  EventPhoto,
  UploadFilePayload
} from "@/types/cms";

const SESSION_KEY = "sjhs_admin_session";
const REQUEST_TIMEOUT_MS = 30000;

export const appsScriptUrl =
  process.env.NEXT_PUBLIC_APPS_SCRIPT_URL?.trim() ?? "";

export function isCmsConfigured() {
  return appsScriptUrl.length > 0;
}

export function getStoredSessionToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(SESSION_KEY) ?? "";
}

export function storeSessionToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_KEY, token);
  }
}

export function clearSessionToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

async function requestCms<T>(
  action: string,
  payload: Record<string, unknown> = {},
  options: { includeSession?: boolean; timeoutMs?: number } = {}
): Promise<ApiResponse<T>> {
  if (!appsScriptUrl) {
    return {
      success: false,
      message:
        "CMS backend is not configured. Add NEXT_PUBLIC_APPS_SCRIPT_URL to enable live content.",
      errorCode: "CMS_NOT_CONFIGURED"
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? REQUEST_TIMEOUT_MS
  );

  const sessionToken = options.includeSession ? getStoredSessionToken() : "";

  try {
    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        action,
        origin:
          typeof window !== "undefined" ? window.location.origin : undefined,
        sessionToken,
        ...payload
      }),
      signal: controller.signal
    });

    const text = await response.text();
    let parsed: ApiResponse<T>;

    try {
      parsed = JSON.parse(text) as ApiResponse<T>;
    } catch {
      return {
        success: false,
        message: "The CMS returned an invalid response.",
        errorCode: "INVALID_JSON"
      };
    }

    if (!parsed.success && parsed.errorCode === "SESSION_EXPIRED") {
      clearSessionToken();
    }

    return parsed;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error && error.name === "AbortError"
          ? "The CMS request timed out. Please try again."
          : "Unable to reach the CMS backend. Check the Apps Script deployment URL.",
      errorCode:
        error instanceof Error && error.name === "AbortError"
          ? "TIMEOUT"
          : "NETWORK_ERROR"
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function fileToUploadPayload(file: File): Promise<UploadFilePayload> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  return {
    fileName: file.name,
    mimeType: file.type,
    base64Data: dataUrl.replace(/^data:[^;]+;base64,/, "")
  };
}

export const cmsApi = {
  adminLogin(username: string, password: string) {
    return requestCms<{ sessionToken: string; user: AdminUser }>("adminLogin", {
      username,
      password
    });
  },

  validateSession() {
    return requestCms<{ user: AdminUser }>(
      "validateSession",
      {},
      { includeSession: true }
    );
  },

  adminLogout() {
    return requestCms("adminLogout", {}, { includeSession: true });
  },

  getPublishedEvents() {
    return requestCms<{ events: CmsEvent[] }>("getPublishedEvents");
  },

  getUpcomingEvents() {
    return requestCms<{ events: CmsEvent[] }>("getUpcomingEvents");
  },

  getArchivedEvents() {
    return requestCms<{ events: CmsEvent[] }>("getArchivedEvents");
  },

  getEventBySlug(slug: string) {
    return requestCms<{ event: CmsEvent; photos: EventPhoto[] }>(
      "getEventBySlug",
      { slug }
    );
  },

  getAllEvents() {
    return requestCms<{ events: CmsEvent[] }>(
      "getAllEvents",
      {},
      { includeSession: true }
    );
  },

  createEvent(event: Partial<CmsEvent>) {
    return requestCms<{ event: CmsEvent }>(
      "createEvent",
      { event },
      { includeSession: true }
    );
  },

  updateEvent(eventId: string, event: Partial<CmsEvent>) {
    return requestCms<{ event: CmsEvent }>(
      "updateEvent",
      { eventId, event },
      { includeSession: true }
    );
  },

  publishEvent(eventId: string) {
    return requestCms("publishEvent", { eventId }, { includeSession: true });
  },

  unpublishEvent(eventId: string) {
    return requestCms("unpublishEvent", { eventId }, { includeSession: true });
  },

  archiveEvent(eventId: string) {
    return requestCms("archiveEvent", { eventId }, { includeSession: true });
  },

  restoreEvent(eventId: string) {
    return requestCms("restoreEvent", { eventId }, { includeSession: true });
  },

  deleteEvent(eventId: string, confirmationTitle: string) {
    return requestCms(
      "deleteEvent",
      { eventId, confirmationTitle },
      { includeSession: true }
    );
  },

  getEventPhotos(eventId: string) {
    return requestCms<{ photos: EventPhoto[] }>(
      "getEventPhotos",
      { eventId },
      { includeSession: true }
    );
  },

  uploadEventPhotos(eventId: string, files: UploadFilePayload[]) {
    return requestCms<{ photos: EventPhoto[] }>(
      "uploadEventPhotos",
      { eventId, files },
      { includeSession: true, timeoutMs: 120000 }
    );
  },

  updateEventPhoto(photoId: string, photo: Partial<EventPhoto>) {
    return requestCms<{ photo: EventPhoto }>(
      "updateEventPhoto",
      { photoId, photo },
      { includeSession: true }
    );
  },

  setEventCoverPhoto(eventId: string, photoId: string) {
    return requestCms(
      "setEventCoverPhoto",
      { eventId, photoId },
      { includeSession: true }
    );
  },

  getPublishedAlbums() {
    return requestCms<{ albums: GalleryAlbum[] }>("getPublishedAlbums");
  },

  getAlbumBySlug(slug: string) {
    return requestCms<{ album: GalleryAlbum; photos: GalleryPhoto[] }>(
      "getAlbumBySlug",
      { slug }
    );
  },

  getAlbumPhotos(albumId: string) {
    return requestCms<{ photos: GalleryPhoto[] }>("getAlbumPhotos", { albumId });
  },

  getAllAlbums() {
    return requestCms<{ albums: GalleryAlbum[] }>(
      "getAllAlbums",
      {},
      { includeSession: true }
    );
  },

  createAlbum(album: Partial<GalleryAlbum>) {
    return requestCms<{ album: GalleryAlbum }>(
      "createAlbum",
      { album },
      { includeSession: true }
    );
  },

  updateAlbum(albumId: string, album: Partial<GalleryAlbum>) {
    return requestCms<{ album: GalleryAlbum }>(
      "updateAlbum",
      { albumId, album },
      { includeSession: true }
    );
  },

  publishAlbum(albumId: string) {
    return requestCms("publishAlbum", { albumId }, { includeSession: true });
  },

  unpublishAlbum(albumId: string) {
    return requestCms("unpublishAlbum", { albumId }, { includeSession: true });
  },

  deleteAlbum(albumId: string) {
    return requestCms("deleteAlbum", { albumId }, { includeSession: true });
  },

  uploadGalleryPhotos(albumId: string, files: UploadFilePayload[]) {
    return requestCms<{ photos: GalleryPhoto[] }>(
      "uploadGalleryPhotos",
      { albumId, files },
      { includeSession: true, timeoutMs: 120000 }
    );
  },

  updateGalleryPhoto(photoId: string, photo: Partial<GalleryPhoto>) {
    return requestCms(
      "updateGalleryPhoto",
      { photoId, photo },
      { includeSession: true }
    );
  },

  deleteGalleryPhoto(photoId: string) {
    return requestCms(
      "deleteGalleryPhoto",
      { photoId },
      { includeSession: true }
    );
  },

  setAlbumCover(albumId: string, photoId: string) {
    return requestCms(
      "setAlbumCover",
      { albumId, photoId },
      { includeSession: true }
    );
  },

  getActivityLog() {
    return requestCms<{ logs: ActivityLogEntry[] }>(
      "getActivityLog",
      {},
      { includeSession: true }
    );
  }
};
