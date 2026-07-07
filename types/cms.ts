export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

export type CmsStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
};

export type AdminUser = {
  USER_ID: string;
  USERNAME: string;
  FULL_NAME: string;
  ROLE: AdminRole;
  STATUS: "ACTIVE" | "INACTIVE";
};

export type CmsEvent = {
  EVENT_ID: string;
  TITLE: string;
  SLUG: string;
  SHORT_DESCRIPTION: string;
  DESCRIPTION: string;
  EVENT_DATE: string;
  END_DATE: string;
  EVENT_TIME: string;
  LOCATION: string;
  EVENT_FOLDER_ID: string;
  COVER_PHOTO_ID: string;
  COVER_PHOTO_URL: string;
  STATUS: CmsStatus;
  ACADEMIC_YEAR: string;
  CREATED_BY: string;
  CREATED_AT: string;
  UPDATED_AT: string;
  PHOTO_COUNT?: number;
};

export type EventPhoto = {
  PHOTO_ID: string;
  EVENT_ID: string;
  DRIVE_FILE_ID: string;
  DRIVE_FOLDER_ID: string;
  FILE_NAME: string;
  MIME_TYPE: string;
  IMAGE_URL: string;
  THUMBNAIL_URL: string;
  CAPTION: string;
  PERSON_NAMES: string;
  ALT_TEXT: string;
  DISPLAY_ORDER: number | string;
  IS_COVER: "TRUE" | "FALSE" | boolean;
  CREATED_BY: string;
  CREATED_AT: string;
  UPDATED_AT: string;
};

export type GalleryAlbum = {
  ALBUM_ID: string;
  TITLE: string;
  SLUG: string;
  DESCRIPTION: string;
  ALBUM_DATE: string;
  LOCATION: string;
  ALBUM_FOLDER_ID: string;
  COVER_PHOTO_ID: string;
  COVER_PHOTO_URL: string;
  STATUS: CmsStatus;
  CREATED_BY: string;
  CREATED_AT: string;
  UPDATED_AT: string;
  PHOTO_COUNT?: number;
};

export type GalleryPhoto = {
  PHOTO_ID: string;
  ALBUM_ID: string;
  DRIVE_FILE_ID: string;
  DRIVE_FOLDER_ID: string;
  FILE_NAME: string;
  MIME_TYPE: string;
  IMAGE_URL: string;
  THUMBNAIL_URL: string;
  CAPTION: string;
  PERSON_NAMES: string;
  ALT_TEXT: string;
  DISPLAY_ORDER: number | string;
  CREATED_BY: string;
  CREATED_AT: string;
  UPDATED_AT: string;
};

export type ActivityLogEntry = {
  LOG_ID: string;
  USER_ID: string;
  ACTION: string;
  ENTITY_TYPE: string;
  ENTITY_ID: string;
  DETAILS: string;
  TIMESTAMP: string;
};

export type UploadFilePayload = {
  fileName: string;
  mimeType: string;
  base64Data: string;
};

export type DashboardStats = {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  upcomingEvents: number;
  totalAlbums: number;
  publishedAlbums: number;
  totalPhotos: number;
};
