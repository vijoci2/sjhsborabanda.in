/**
 * St. Joseph's High School Website CMS
 * Google Apps Script Web App API
 *
 * Required Script Properties:
 * SPREADSHEET_ID, CMS_PARENT_FOLDER_ID, EVENTS_FOLDER_ID, GALLERY_FOLDER_ID,
 * SESSION_SECRET, ALLOWED_ORIGIN, APP_NAME
 */

var SHEET_HEADERS = {
  ADMIN_USERS: [
    "USER_ID",
    "USERNAME",
    "PASSWORD_HASH",
    "FULL_NAME",
    "ROLE",
    "STATUS",
    "CREATED_AT",
    "UPDATED_AT"
  ],
  ADMIN_SESSIONS: [
    "SESSION_ID",
    "USER_ID",
    "TOKEN_HASH",
    "CREATED_AT",
    "EXPIRES_AT",
    "LAST_ACTIVITY",
    "STATUS"
  ],
  EVENTS: [
    "EVENT_ID",
    "TITLE",
    "SLUG",
    "SHORT_DESCRIPTION",
    "DESCRIPTION",
    "EVENT_DATE",
    "END_DATE",
    "EVENT_TIME",
    "LOCATION",
    "EVENT_FOLDER_ID",
    "COVER_PHOTO_ID",
    "COVER_PHOTO_URL",
    "STATUS",
    "ACADEMIC_YEAR",
    "CREATED_BY",
    "CREATED_AT",
    "UPDATED_AT"
  ],
  EVENT_PHOTOS: [
    "PHOTO_ID",
    "EVENT_ID",
    "DRIVE_FILE_ID",
    "DRIVE_FOLDER_ID",
    "FILE_NAME",
    "MIME_TYPE",
    "IMAGE_URL",
    "THUMBNAIL_URL",
    "CAPTION",
    "PERSON_NAMES",
    "ALT_TEXT",
    "DISPLAY_ORDER",
    "IS_COVER",
    "CREATED_BY",
    "CREATED_AT",
    "UPDATED_AT"
  ],
  GALLERY_ALBUMS: [
    "ALBUM_ID",
    "TITLE",
    "SLUG",
    "DESCRIPTION",
    "ALBUM_DATE",
    "LOCATION",
    "DRIVE_FOLDER_URL",
    "ALBUM_FOLDER_ID",
    "COVER_PHOTO_ID",
    "COVER_PHOTO_URL",
    "STATUS",
    "CREATED_BY",
    "CREATED_AT",
    "UPDATED_AT"
  ],
  GALLERY_PHOTOS: [
    "PHOTO_ID",
    "ALBUM_ID",
    "DRIVE_FILE_ID",
    "DRIVE_FOLDER_ID",
    "FILE_NAME",
    "MIME_TYPE",
    "IMAGE_URL",
    "THUMBNAIL_URL",
    "CAPTION",
    "PERSON_NAMES",
    "ALT_TEXT",
    "DISPLAY_ORDER",
    "CREATED_BY",
    "CREATED_AT",
    "UPDATED_AT"
  ],
  ACTIVITY_LOG: [
    "LOG_ID",
    "USER_ID",
    "ACTION",
    "ENTITY_TYPE",
    "ENTITY_ID",
    "DETAILS",
    "TIMESTAMP"
  ]
};

var PUBLIC_ACTIONS = {
  getPublishedEvents: true,
  getUpcomingEvents: true,
  getArchivedEvents: true,
  getEventBySlug: true,
  getPublishedAlbums: true,
  getAlbumBySlug: true,
  getAlbumPhotos: true
};

var IMAGE_TYPES = {
  "image/jpeg": true,
  "image/jpg": true,
  "image/png": true,
  "image/webp": true
};

var MAX_IMAGE_BYTES = 8 * 1024 * 1024;
var MAX_BATCH_IMAGES = 25;
var MAX_LINKED_ALBUM_IMAGES = 120;
var SESSION_HOURS = 8;
var DATABASE_SPREADSHEET_ID = "1oet7lULdj8qqXTMGc9itXP7yccCpIDzDi7w9FdtRidk";
var DEFAULT_ADMIN_USERNAME = "admin";
var DEFAULT_ADMIN_PASSWORD = "198917";
var DEFAULT_ADMIN_FULL_NAME = "St Joseph Admin";
var CMS_SPREADSHEET_CACHE = null;

function doGet(e) {
  return routeRequest(e);
}

function doPost(e) {
  return routeRequest(e);
}

function routeRequest(e) {
  try {
    var payload = parsePayload(e);
    var action = payload.action;

    if (!action) {
      return jsonError("Missing API action.", "MISSING_ACTION");
    }

    if (!PUBLIC_ACTIONS[action]) {
      verifyOrigin(payload);
    }

    var routes = {
      adminLogin: adminLogin,
      validateSession: validateSessionAction,
      adminLogout: adminLogout,
      getPublishedEvents: getPublishedEvents,
      getUpcomingEvents: getUpcomingEvents,
      getArchivedEvents: getArchivedEvents,
      getEventBySlug: getEventBySlug,
      getAllEvents: getAllEvents,
      createEvent: createEvent,
      updateEvent: updateEvent,
      publishEvent: publishEvent,
      unpublishEvent: unpublishEvent,
      archiveEvent: archiveEvent,
      restoreEvent: restoreEvent,
      deleteEvent: deleteEvent,
      getEventPhotos: getEventPhotos,
      uploadEventPhotos: uploadEventPhotos,
      updateEventPhoto: updateEventPhoto,
      reorderEventPhotos: reorderEventPhotos,
      setEventCoverPhoto: setEventCoverPhoto,
      getPublishedAlbums: getPublishedAlbums,
      getAlbumBySlug: getAlbumBySlug,
      getAlbumPhotos: getAlbumPhotos,
      getAllAlbums: getAllAlbums,
      createAlbum: createAlbum,
      updateAlbum: updateAlbum,
      publishAlbum: publishAlbum,
      unpublishAlbum: unpublishAlbum,
      deleteAlbum: deleteAlbum,
      uploadGalleryPhotos: uploadGalleryPhotos,
      updateGalleryPhoto: updateGalleryPhoto,
      deleteGalleryPhoto: deleteGalleryPhoto,
      reorderGalleryPhotos: reorderGalleryPhotos,
      setAlbumCover: setAlbumCover,
      getActivityLog: getActivityLog
    };

    if (!routes[action]) {
      return jsonError("Unknown API action.", "UNKNOWN_ACTION");
    }

    return routes[action](payload);
  } catch (error) {
    return jsonError(error.message || "Unexpected server error.", "SERVER_ERROR");
  }
}

function setupCMS() {
  var props = PropertiesService.getScriptProperties();
  var spreadsheetId = DATABASE_SPREADSHEET_ID || props.getProperty("SPREADSHEET_ID");
  var spreadsheet;

  if (spreadsheetId) {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    props.setProperty("SPREADSHEET_ID", spreadsheet.getId());
  } else {
    spreadsheet = SpreadsheetApp.create("St Joseph School Website CMS");
    props.setProperty("SPREADSHEET_ID", spreadsheet.getId());
  }

  Object.keys(SHEET_HEADERS).forEach(function (sheetName) {
    ensureSheet(spreadsheet, sheetName, SHEET_HEADERS[sheetName]);
  });

  if (!props.getProperty("SESSION_SECRET")) {
    props.setProperty("SESSION_SECRET", Utilities.getUuid() + Utilities.getUuid());
  }
  if (!props.getProperty("APP_NAME")) {
    props.setProperty("APP_NAME", "St Joseph School Website CMS");
  }

  var parentFolder = getOrCreateConfiguredFolder(
    props,
    "CMS_PARENT_FOLDER_ID",
    "School Website CMS",
    null
  );
  getOrCreateConfiguredFolder(props, "EVENTS_FOLDER_ID", "Events", parentFolder);
  getOrCreateConfiguredFolder(props, "GALLERY_FOLDER_ID", "Gallery", parentFolder);
  ensureDefaultAdmin();

  Logger.log("CMS database spreadsheet: " + spreadsheet.getUrl());
  return "CMS setup complete. Tables are ready and the default admin login is available.";
}

function setupDatabase() {
  return setupCMS();
}

function createInitialAdmin(username, password, fullName) {
  setupCMS();

  username = username || DEFAULT_ADMIN_USERNAME;
  password = password || DEFAULT_ADMIN_PASSWORD;
  fullName = fullName || DEFAULT_ADMIN_FULL_NAME;

  if (!username || !password || !fullName) {
    throw new Error("Username, password, and full name are required.");
  }

  var users = getRows("ADMIN_USERS");
  var exists = users.some(function (user) {
    return String(user.USERNAME).toLowerCase() === String(username).toLowerCase();
  });

  if (exists) {
    return "Admin username already exists. No duplicate user was created.";
  }

  appendObjectRow("ADMIN_USERS", {
    USER_ID: generateUniqueId("USR"),
    USERNAME: sanitizeText(username),
    PASSWORD_HASH: hashPassword(password),
    FULL_NAME: sanitizeText(fullName),
    ROLE: "SUPER_ADMIN",
    STATUS: "ACTIVE",
    CREATED_AT: nowIso(),
    UPDATED_AT: nowIso()
  });

  return "Initial administrator created.";
}

function ensureDefaultAdmin() {
  var users = getRows("ADMIN_USERS");
  var exists = users.some(function (user) {
    return String(user.USERNAME).toLowerCase() === DEFAULT_ADMIN_USERNAME.toLowerCase();
  });

  if (exists) {
    return;
  }

  appendObjectRow("ADMIN_USERS", {
    USER_ID: generateUniqueId("USR"),
    USERNAME: DEFAULT_ADMIN_USERNAME,
    PASSWORD_HASH: hashPassword(DEFAULT_ADMIN_PASSWORD),
    FULL_NAME: DEFAULT_ADMIN_FULL_NAME,
    ROLE: "SUPER_ADMIN",
    STATUS: "ACTIVE",
    CREATED_AT: nowIso(),
    UPDATED_AT: nowIso()
  });
}

function adminLogin(payload) {
  var username = sanitizeText(payload.username || "");
  var password = String(payload.password || "");

  if (!username || !password) {
    return jsonError("Username and password are required.", "VALIDATION_ERROR");
  }

  var rateKey = "login:" + username.toLowerCase();
  var cache = CacheService.getScriptCache();
  var attempts = Number(cache.get(rateKey) || "0");

  if (attempts >= 5) {
    return jsonError("Too many failed attempts. Please try again later.", "RATE_LIMITED");
  }

  var user = getRows("ADMIN_USERS").find(function (row) {
    return (
      String(row.USERNAME).toLowerCase() === username.toLowerCase() &&
      row.STATUS === "ACTIVE"
    );
  });

  if (!user || user.PASSWORD_HASH !== hashPassword(password)) {
    cache.put(rateKey, String(attempts + 1), 900);
    return jsonError("Invalid username or password.", "INVALID_CREDENTIALS");
  }

  cache.remove(rateKey);

  var token = generateSessionToken();
  appendObjectRow("ADMIN_SESSIONS", {
    SESSION_ID: generateUniqueId("SES"),
    USER_ID: user.USER_ID,
    TOKEN_HASH: hashToken(token),
    CREATED_AT: nowIso(),
    EXPIRES_AT: addHoursIso(SESSION_HOURS),
    LAST_ACTIVITY: nowIso(),
    STATUS: "ACTIVE"
  });

  return jsonSuccess("Login successful.", {
    sessionToken: token,
    user: publicUser(user)
  });
}

function validateSessionAction(payload) {
  var session = validateAdminSession(payload.sessionToken);
  return jsonSuccess("Session valid.", { user: publicUser(session.user) });
}

function adminLogout(payload) {
  var session = validateAdminSession(payload.sessionToken);
  updateRowById("ADMIN_SESSIONS", "SESSION_ID", session.session.SESSION_ID, {
    STATUS: "LOGGED_OUT",
    UPDATED_AT: nowIso()
  });
  logActivity(session.user.USER_ID, "ADMIN_LOGOUT", "ADMIN_USER", session.user.USER_ID, "");
  return jsonSuccess("Logged out.");
}

function getPublishedEvents() {
  var data = getEventsWithPhotoCount().filter(function (event) {
    return event.STATUS === "PUBLISHED" || event.STATUS === "ARCHIVED";
  });
  return jsonSuccess("Published events loaded.", { events: data });
}

function getUpcomingEvents() {
  var today = dateOnly(new Date());
  var data = getEventsWithPhotoCount()
    .filter(function (event) {
      return event.STATUS === "PUBLISHED" && event.EVENT_DATE >= today;
    })
    .sort(function (a, b) {
      return String(a.EVENT_DATE).localeCompare(String(b.EVENT_DATE));
    });
  return jsonSuccess("Upcoming events loaded.", { events: data });
}

function getArchivedEvents() {
  var today = dateOnly(new Date());
  var data = getEventsWithPhotoCount()
    .filter(function (event) {
      return (
        event.STATUS === "ARCHIVED" ||
        ((event.STATUS === "PUBLISHED" || event.STATUS === "ARCHIVED") &&
          event.EVENT_DATE < today)
      );
    })
    .sort(function (a, b) {
      return String(b.EVENT_DATE).localeCompare(String(a.EVENT_DATE));
    });
  return jsonSuccess("Archived events loaded.", { events: data });
}

function getEventBySlug(payload) {
  var slug = sanitizeSlug(payload.slug || "");
  var event = getEventsWithPhotoCount().find(function (item) {
    return item.SLUG === slug && (item.STATUS === "PUBLISHED" || item.STATUS === "ARCHIVED");
  });

  if (!event) {
    return jsonError("Event not found.", "NOT_FOUND");
  }

  return jsonSuccess("Event loaded.", {
    event: event,
    photos: getRows("EVENT_PHOTOS")
      .filter(function (photo) {
        return photo.EVENT_ID === event.EVENT_ID;
      })
      .sort(sortByDisplayOrder)
  });
}

function getAllEvents(payload) {
  validateAdminSession(payload.sessionToken);
  return jsonSuccess("Events loaded.", { events: getEventsWithPhotoCount() });
}

function createEvent(payload) {
  var session = validateAdminSession(payload.sessionToken);
  var event = payload.event || {};
  var title = sanitizeText(event.TITLE || event.title || "");
  var description = sanitizeLongText(event.DESCRIPTION || event.description || "");
  var eventDate = sanitizeText(event.EVENT_DATE || event.eventDate || "");

  if (!title || !description || !eventDate) {
    return jsonError("Title, description, and event date are required.", "VALIDATION_ERROR");
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var eventsFolder = DriveApp.getFolderById(getRequiredProperty("EVENTS_FOLDER_ID"));
    var eventFolder = eventsFolder.createFolder(safeFileName(title + " " + eventDate));
    var newEvent = {
      EVENT_ID: generateUniqueId("EVT"),
      TITLE: title,
      SLUG: generateUniqueSlug("EVENTS", "SLUG", title),
      SHORT_DESCRIPTION: sanitizeLongText(event.SHORT_DESCRIPTION || ""),
      DESCRIPTION: description,
      EVENT_DATE: eventDate,
      END_DATE: sanitizeText(event.END_DATE || ""),
      EVENT_TIME: sanitizeText(event.EVENT_TIME || ""),
      LOCATION: sanitizeText(event.LOCATION || ""),
      EVENT_FOLDER_ID: eventFolder.getId(),
      COVER_PHOTO_ID: "",
      COVER_PHOTO_URL: "",
      STATUS: normalizeStatus(event.STATUS, ["DRAFT", "PUBLISHED", "ARCHIVED"]),
      ACADEMIC_YEAR: sanitizeText(event.ACADEMIC_YEAR || ""),
      CREATED_BY: session.user.USER_ID,
      CREATED_AT: nowIso(),
      UPDATED_AT: nowIso()
    };

    appendObjectRow("EVENTS", newEvent);
    clearPublicCache();
    logActivity(session.user.USER_ID, "EVENT_CREATED", "EVENT", newEvent.EVENT_ID, title);
    return jsonSuccess("Event created successfully.", { event: newEvent });
  } finally {
    lock.releaseLock();
  }
}

function updateEvent(payload) {
  var session = validateAdminSession(payload.sessionToken);
  var eventId = sanitizeText(payload.eventId || "");
  var current = findRowById("EVENTS", "EVENT_ID", eventId);

  if (!current) {
    return jsonError("Event not found.", "NOT_FOUND");
  }

  var input = payload.event || {};
  var updates = {
    TITLE: sanitizeText(input.TITLE || current.TITLE),
    SHORT_DESCRIPTION: sanitizeLongText(input.SHORT_DESCRIPTION || ""),
    DESCRIPTION: sanitizeLongText(input.DESCRIPTION || current.DESCRIPTION),
    EVENT_DATE: sanitizeText(input.EVENT_DATE || current.EVENT_DATE),
    END_DATE: sanitizeText(input.END_DATE || ""),
    EVENT_TIME: sanitizeText(input.EVENT_TIME || ""),
    LOCATION: sanitizeText(input.LOCATION || ""),
    STATUS: normalizeStatus(input.STATUS || current.STATUS, ["DRAFT", "PUBLISHED", "ARCHIVED"]),
    ACADEMIC_YEAR: sanitizeText(input.ACADEMIC_YEAR || ""),
    UPDATED_AT: nowIso()
  };

  updateRowById("EVENTS", "EVENT_ID", eventId, updates);
  clearPublicCache();
  logActivity(session.user.USER_ID, "EVENT_UPDATED", "EVENT", eventId, updates.TITLE);
  return jsonSuccess("Event updated successfully.", {
    event: findRowById("EVENTS", "EVENT_ID", eventId)
  });
}

function publishEvent(payload) {
  return updateEventStatus(payload, "PUBLISHED", "EVENT_PUBLISHED", "Event published.");
}

function unpublishEvent(payload) {
  return updateEventStatus(payload, "DRAFT", "EVENT_UNPUBLISHED", "Event unpublished.");
}

function archiveEvent(payload) {
  return updateEventStatus(payload, "ARCHIVED", "EVENT_ARCHIVED", "Event archived.");
}

function restoreEvent(payload) {
  return updateEventStatus(payload, "PUBLISHED", "EVENT_RESTORED", "Event restored.");
}

function updateEventStatus(payload, status, action, message) {
  var session = validateAdminSession(payload.sessionToken);
  var eventId = sanitizeText(payload.eventId || "");
  if (!findRowById("EVENTS", "EVENT_ID", eventId)) {
    return jsonError("Event not found.", "NOT_FOUND");
  }
  updateRowById("EVENTS", "EVENT_ID", eventId, {
    STATUS: status,
    UPDATED_AT: nowIso()
  });
  clearPublicCache();
  logActivity(session.user.USER_ID, action, "EVENT", eventId, status);
  return jsonSuccess(message);
}

function deleteEvent(payload) {
  var session = validateAdminSession(payload.sessionToken);
  if (session.user.ROLE !== "SUPER_ADMIN") {
    return jsonError("Only a SUPER_ADMIN may permanently delete events.", "FORBIDDEN");
  }

  var eventId = sanitizeText(payload.eventId || "");
  var event = findRowById("EVENTS", "EVENT_ID", eventId);
  if (!event) {
    return jsonError("Event not found.", "NOT_FOUND");
  }
  if (payload.confirmationTitle !== event.TITLE) {
    return jsonError("Confirmation title did not match.", "CONFIRMATION_REQUIRED");
  }

  var photos = getRows("EVENT_PHOTOS").filter(function (photo) {
    return photo.EVENT_ID === eventId;
  });
  photos.forEach(function (photo) {
    trashFileSafely(photo.DRIVE_FILE_ID, [event.EVENT_FOLDER_ID]);
    deleteRowById("EVENT_PHOTOS", "PHOTO_ID", photo.PHOTO_ID);
  });
  trashFolderSafely(event.EVENT_FOLDER_ID, getRequiredProperty("EVENTS_FOLDER_ID"));
  deleteRowById("EVENTS", "EVENT_ID", eventId);
  clearPublicCache();
  logActivity(session.user.USER_ID, "EVENT_PERMANENTLY_DELETED", "EVENT", eventId, event.TITLE);
  return jsonSuccess("Event permanently deleted.");
}

function uploadEventPhotos(payload) {
  var session = validateAdminSession(payload.sessionToken);
  var eventId = sanitizeText(payload.eventId || "");
  var event = findRowById("EVENTS", "EVENT_ID", eventId);
  if (!event) {
    return jsonError("Event not found.", "NOT_FOUND");
  }

  var files = payload.files || [];
  if (!Array.isArray(files) || !files.length) {
    return jsonError("No files supplied.", "VALIDATION_ERROR");
  }
  if (files.length > MAX_BATCH_IMAGES) {
    return jsonError("Upload a maximum of 25 images per batch.", "TOO_MANY_FILES");
  }

  var folder = DriveApp.getFolderById(event.EVENT_FOLDER_ID);
  var existingPhotos = getRows("EVENT_PHOTOS").filter(function (photo) {
    return photo.EVENT_ID === eventId;
  });
  var nextOrder = existingPhotos.length + 1;
  var savedPhotos = [];

  files.forEach(function (filePayload) {
    var saved = saveImagePayloadToFolder(filePayload, folder, session.user.USER_ID);
    var photo = {
      PHOTO_ID: generateUniqueId("EPH"),
      EVENT_ID: eventId,
      DRIVE_FILE_ID: saved.fileId,
      DRIVE_FOLDER_ID: folder.getId(),
      FILE_NAME: saved.fileName,
      MIME_TYPE: saved.mimeType,
      IMAGE_URL: saved.imageUrl,
      THUMBNAIL_URL: saved.thumbnailUrl,
      CAPTION: sanitizeLongText(filePayload.caption || ""),
      PERSON_NAMES: sanitizeText(filePayload.personNames || ""),
      ALT_TEXT: sanitizeText(filePayload.altText || event.TITLE),
      DISPLAY_ORDER: nextOrder++,
      IS_COVER: existingPhotos.length || savedPhotos.length ? "FALSE" : "TRUE",
      CREATED_BY: session.user.USER_ID,
      CREATED_AT: nowIso(),
      UPDATED_AT: nowIso()
    };
    appendObjectRow("EVENT_PHOTOS", photo);
    savedPhotos.push(photo);
  });

  if (!event.COVER_PHOTO_ID && savedPhotos.length) {
    updateRowById("EVENTS", "EVENT_ID", eventId, {
      COVER_PHOTO_ID: savedPhotos[0].PHOTO_ID,
      COVER_PHOTO_URL: savedPhotos[0].IMAGE_URL,
      UPDATED_AT: nowIso()
    });
  }

  clearPublicCache();
  logActivity(session.user.USER_ID, "EVENT_PHOTOS_UPLOADED", "EVENT", eventId, String(savedPhotos.length));
  return jsonSuccess("Event photographs uploaded.", { photos: savedPhotos });
}

function getEventPhotos(payload) {
  validateAdminSession(payload.sessionToken);
  var eventId = sanitizeText(payload.eventId || "");
  if (!findRowById("EVENTS", "EVENT_ID", eventId)) {
    return jsonError("Event not found.", "NOT_FOUND");
  }
  return jsonSuccess("Event photographs loaded.", {
    photos: getEventPhotoRows(eventId)
  });
}

function updateEventPhoto(payload) {
  var session = validateAdminSession(payload.sessionToken);
  var photoId = sanitizeText(payload.photoId || "");
  var photo = findRowById("EVENT_PHOTOS", "PHOTO_ID", photoId);
  if (!photo) {
    return jsonError("Photo not found.", "NOT_FOUND");
  }

  var input = payload.photo || {};
  var updates = {
    CAPTION: sanitizeLongText(input.CAPTION || ""),
    PERSON_NAMES: sanitizeText(input.PERSON_NAMES || ""),
    ALT_TEXT: sanitizeText(input.ALT_TEXT || ""),
    DISPLAY_ORDER: sanitizeText(input.DISPLAY_ORDER || photo.DISPLAY_ORDER),
    UPDATED_AT: nowIso()
  };
  updateRowById("EVENT_PHOTOS", "PHOTO_ID", photoId, updates);
  clearPublicCache();
  logActivity(session.user.USER_ID, "EVENT_PHOTO_UPDATED", "EVENT_PHOTO", photoId, updates.CAPTION);
  return jsonSuccess("Event photograph updated.", {
    photo: findRowById("EVENT_PHOTOS", "PHOTO_ID", photoId)
  });
}

function reorderEventPhotos(payload) {
  var session = validateAdminSession(payload.sessionToken);
  var order = payload.order || [];
  if (!Array.isArray(order)) {
    return jsonError("Invalid order payload.", "VALIDATION_ERROR");
  }
  order.forEach(function (item, index) {
    updateRowById("EVENT_PHOTOS", "PHOTO_ID", sanitizeText(item.photoId), {
      DISPLAY_ORDER: index + 1,
      UPDATED_AT: nowIso()
    });
  });
  clearPublicCache();
  logActivity(session.user.USER_ID, "EVENT_PHOTOS_REORDERED", "EVENT", sanitizeText(payload.eventId || ""), "");
  return jsonSuccess("Event photographs reordered.");
}

function setEventCoverPhoto(payload) {
  var session = validateAdminSession(payload.sessionToken);
  var eventId = sanitizeText(payload.eventId || "");
  var photoId = sanitizeText(payload.photoId || "");
  var event = findRowById("EVENTS", "EVENT_ID", eventId);
  var photo = findRowById("EVENT_PHOTOS", "PHOTO_ID", photoId);

  if (!event) {
    return jsonError("Event not found.", "NOT_FOUND");
  }
  if (!photo || photo.EVENT_ID !== eventId) {
    return jsonError("Photo does not belong to this event.", "VALIDATION_ERROR");
  }

  getEventPhotoRows(eventId).forEach(function (item) {
    updateRowById("EVENT_PHOTOS", "PHOTO_ID", item.PHOTO_ID, {
      IS_COVER: item.PHOTO_ID === photoId ? "TRUE" : "FALSE",
      UPDATED_AT: nowIso()
    });
  });
  updateRowById("EVENTS", "EVENT_ID", eventId, {
    COVER_PHOTO_ID: photoId,
    COVER_PHOTO_URL: photo.IMAGE_URL,
    UPDATED_AT: nowIso()
  });
  clearPublicCache();
  logActivity(session.user.USER_ID, "EVENT_COVER_CHANGED", "EVENT", eventId, photoId);
  return jsonSuccess("Event cover updated.");
}

function getPublishedAlbums() {
  var albums = getAlbumsWithPhotoCount().filter(function (album) {
    return album.STATUS === "PUBLISHED";
  });
  return jsonSuccess("Published albums loaded.", { albums: albums });
}

function getAlbumBySlug(payload) {
  var slug = sanitizeSlug(payload.slug || "");
  var album = getAlbumsWithPhotoCount().find(function (item) {
    return item.SLUG === slug && item.STATUS === "PUBLISHED";
  });
  if (!album) {
    return jsonError("Album not found.", "NOT_FOUND");
  }
  return jsonSuccess("Album loaded.", {
    album: album,
    photos: getAlbumPhotoRows(album.ALBUM_ID, album)
  });
}

function getAlbumPhotos(payload) {
  var albumId = sanitizeText(payload.albumId || "");
  var album = findRowById("GALLERY_ALBUMS", "ALBUM_ID", albumId);
  if (!album) {
    return jsonError("Album not found.", "NOT_FOUND");
  }
  return jsonSuccess("Album photos loaded.", { photos: getAlbumPhotoRows(albumId, album) });
}

function getAllAlbums(payload) {
  validateAdminSession(payload.sessionToken);
  return jsonSuccess("Albums loaded.", { albums: getAlbumsWithPhotoCount() });
}

function createAlbum(payload) {
  var session = validateAdminSession(payload.sessionToken);
  var album = payload.album || {};
  var title = sanitizeText(album.TITLE || "");
  var albumDate = sanitizeText(album.ALBUM_DATE || "");
  if (!title || !albumDate) {
    return jsonError("Album title and date are required.", "VALIDATION_ERROR");
  }

  var galleryFolder = DriveApp.getFolderById(getRequiredProperty("GALLERY_FOLDER_ID"));
  var albumFolder = galleryFolder.createFolder(safeFileName(title + " " + albumDate));
  var newAlbum = {
    ALBUM_ID: generateUniqueId("ALB"),
    TITLE: title,
    SLUG: generateUniqueSlug("GALLERY_ALBUMS", "SLUG", title),
    DESCRIPTION: sanitizeLongText(album.DESCRIPTION || ""),
    ALBUM_DATE: albumDate,
    LOCATION: sanitizeText(album.LOCATION || ""),
    DRIVE_FOLDER_URL: sanitizeUrl(album.DRIVE_FOLDER_URL || ""),
    ALBUM_FOLDER_ID: albumFolder.getId(),
    COVER_PHOTO_ID: "",
    COVER_PHOTO_URL: "",
    STATUS: normalizeStatus(album.STATUS, ["DRAFT", "PUBLISHED"]),
    CREATED_BY: session.user.USER_ID,
    CREATED_AT: nowIso(),
    UPDATED_AT: nowIso()
  };
  appendObjectRow("GALLERY_ALBUMS", newAlbum);
  clearPublicCache();
  logActivity(session.user.USER_ID, "ALBUM_CREATED", "ALBUM", newAlbum.ALBUM_ID, title);
  return jsonSuccess("Album created successfully.", { album: newAlbum });
}

function updateAlbum(payload) {
  var session = validateAdminSession(payload.sessionToken);
  var albumId = sanitizeText(payload.albumId || "");
  var current = findRowById("GALLERY_ALBUMS", "ALBUM_ID", albumId);
  if (!current) {
    return jsonError("Album not found.", "NOT_FOUND");
  }
  var album = payload.album || {};
  var hasOwn = Object.prototype.hasOwnProperty;
  var updates = {
    TITLE: hasOwn.call(album, "TITLE") ? sanitizeText(album.TITLE) : current.TITLE,
    DESCRIPTION: hasOwn.call(album, "DESCRIPTION")
      ? sanitizeLongText(album.DESCRIPTION)
      : current.DESCRIPTION,
    ALBUM_DATE: hasOwn.call(album, "ALBUM_DATE")
      ? sanitizeText(album.ALBUM_DATE)
      : current.ALBUM_DATE,
    LOCATION: hasOwn.call(album, "LOCATION") ? sanitizeText(album.LOCATION) : current.LOCATION,
    DRIVE_FOLDER_URL: hasOwn.call(album, "DRIVE_FOLDER_URL")
      ? sanitizeUrl(album.DRIVE_FOLDER_URL)
      : current.DRIVE_FOLDER_URL,
    STATUS: hasOwn.call(album, "STATUS")
      ? normalizeStatus(album.STATUS, ["DRAFT", "PUBLISHED"])
      : current.STATUS,
    UPDATED_AT: nowIso()
  };
  updateRowById("GALLERY_ALBUMS", "ALBUM_ID", albumId, updates);
  clearPublicCache();
  logActivity(session.user.USER_ID, "ALBUM_UPDATED", "ALBUM", albumId, updates.TITLE);
  return jsonSuccess("Album updated successfully.", {
    album: findRowById("GALLERY_ALBUMS", "ALBUM_ID", albumId)
  });
}

function publishAlbum(payload) {
  return updateAlbumStatus(payload, "PUBLISHED", "ALBUM_PUBLISHED", "Album published.");
}

function unpublishAlbum(payload) {
  return updateAlbumStatus(payload, "DRAFT", "ALBUM_UNPUBLISHED", "Album unpublished.");
}

function updateAlbumStatus(payload, status, action, message) {
  var session = validateAdminSession(payload.sessionToken);
  var albumId = sanitizeText(payload.albumId || "");
  if (!findRowById("GALLERY_ALBUMS", "ALBUM_ID", albumId)) {
    return jsonError("Album not found.", "NOT_FOUND");
  }
  updateRowById("GALLERY_ALBUMS", "ALBUM_ID", albumId, {
    STATUS: status,
    UPDATED_AT: nowIso()
  });
  clearPublicCache();
  logActivity(session.user.USER_ID, action, "ALBUM", albumId, status);
  return jsonSuccess(message);
}

function uploadGalleryPhotos(payload) {
  var session = validateAdminSession(payload.sessionToken);
  var albumId = sanitizeText(payload.albumId || "");
  var album = findRowById("GALLERY_ALBUMS", "ALBUM_ID", albumId);
  if (!album) {
    return jsonError("Album not found.", "NOT_FOUND");
  }
  var files = payload.files || [];
  if (!Array.isArray(files) || !files.length) {
    return jsonError("No files supplied.", "VALIDATION_ERROR");
  }
  if (files.length > MAX_BATCH_IMAGES) {
    return jsonError("Upload a maximum of 25 images per batch.", "TOO_MANY_FILES");
  }

  var folder = DriveApp.getFolderById(album.ALBUM_FOLDER_ID);
  var existingPhotos = getAlbumPhotoRows(albumId);
  var nextOrder = existingPhotos.length + 1;
  var savedPhotos = [];

  files.forEach(function (filePayload) {
    var saved = saveImagePayloadToFolder(filePayload, folder, session.user.USER_ID);
    var photo = {
      PHOTO_ID: generateUniqueId("GPH"),
      ALBUM_ID: albumId,
      DRIVE_FILE_ID: saved.fileId,
      DRIVE_FOLDER_ID: folder.getId(),
      FILE_NAME: saved.fileName,
      MIME_TYPE: saved.mimeType,
      IMAGE_URL: saved.imageUrl,
      THUMBNAIL_URL: saved.thumbnailUrl,
      CAPTION: sanitizeLongText(filePayload.caption || ""),
      PERSON_NAMES: sanitizeText(filePayload.personNames || ""),
      ALT_TEXT: sanitizeText(filePayload.altText || album.TITLE),
      DISPLAY_ORDER: nextOrder++,
      CREATED_BY: session.user.USER_ID,
      CREATED_AT: nowIso(),
      UPDATED_AT: nowIso()
    };
    appendObjectRow("GALLERY_PHOTOS", photo);
    savedPhotos.push(photo);
  });

  if (!album.COVER_PHOTO_ID && savedPhotos.length) {
    updateRowById("GALLERY_ALBUMS", "ALBUM_ID", albumId, {
      COVER_PHOTO_ID: savedPhotos[0].PHOTO_ID,
      COVER_PHOTO_URL: savedPhotos[0].IMAGE_URL,
      UPDATED_AT: nowIso()
    });
  }

  clearPublicCache();
  logActivity(session.user.USER_ID, "PHOTO_UPLOADED", "ALBUM", albumId, String(savedPhotos.length));
  return jsonSuccess("Gallery photographs uploaded.", { photos: savedPhotos });
}

function updateGalleryPhoto(payload) {
  var session = validateAdminSession(payload.sessionToken);
  var photoId = sanitizeText(payload.photoId || "");
  var photo = findRowById("GALLERY_PHOTOS", "PHOTO_ID", photoId);
  if (!photo) {
    return jsonError("Photo not found.", "NOT_FOUND");
  }
  var input = payload.photo || {};
  var updates = {
    CAPTION: sanitizeLongText(input.CAPTION || ""),
    PERSON_NAMES: sanitizeText(input.PERSON_NAMES || ""),
    ALT_TEXT: sanitizeText(input.ALT_TEXT || ""),
    DISPLAY_ORDER: sanitizeText(input.DISPLAY_ORDER || photo.DISPLAY_ORDER),
    UPDATED_AT: nowIso()
  };
  updateRowById("GALLERY_PHOTOS", "PHOTO_ID", photoId, updates);
  clearPublicCache();
  logActivity(session.user.USER_ID, "PHOTO_UPDATED", "PHOTO", photoId, updates.CAPTION);
  return jsonSuccess("Photo updated.");
}

function deleteGalleryPhoto(payload) {
  var session = validateAdminSession(payload.sessionToken);
  var photoId = sanitizeText(payload.photoId || "");
  var photo = findRowById("GALLERY_PHOTOS", "PHOTO_ID", photoId);
  if (!photo) {
    return jsonError("Photo not found.", "NOT_FOUND");
  }
  var album = findRowById("GALLERY_ALBUMS", "ALBUM_ID", photo.ALBUM_ID);
  if (!album) {
    return jsonError("Album not found.", "NOT_FOUND");
  }
  trashFileSafely(photo.DRIVE_FILE_ID, [album.ALBUM_FOLDER_ID]);
  deleteRowById("GALLERY_PHOTOS", "PHOTO_ID", photoId);
  if (album.COVER_PHOTO_ID === photoId) {
    var nextPhoto = getAlbumPhotoRows(album.ALBUM_ID)[0];
    updateRowById("GALLERY_ALBUMS", "ALBUM_ID", album.ALBUM_ID, {
      COVER_PHOTO_ID: nextPhoto ? nextPhoto.PHOTO_ID : "",
      COVER_PHOTO_URL: nextPhoto ? nextPhoto.IMAGE_URL : "",
      UPDATED_AT: nowIso()
    });
  }
  clearPublicCache();
  logActivity(session.user.USER_ID, "PHOTO_DELETED", "PHOTO", photoId, photo.FILE_NAME);
  return jsonSuccess("Photo deleted.");
}

function reorderGalleryPhotos(payload) {
  var session = validateAdminSession(payload.sessionToken);
  var order = payload.order || [];
  if (!Array.isArray(order)) {
    return jsonError("Invalid order payload.", "VALIDATION_ERROR");
  }
  order.forEach(function (item, index) {
    updateRowById("GALLERY_PHOTOS", "PHOTO_ID", sanitizeText(item.photoId), {
      DISPLAY_ORDER: index + 1,
      UPDATED_AT: nowIso()
    });
  });
  clearPublicCache();
  logActivity(session.user.USER_ID, "PHOTOS_REORDERED", "ALBUM", sanitizeText(payload.albumId || ""), "");
  return jsonSuccess("Photos reordered.");
}

function setAlbumCover(payload) {
  var session = validateAdminSession(payload.sessionToken);
  var albumId = sanitizeText(payload.albumId || "");
  var photoId = sanitizeText(payload.photoId || "");
  var photo = findRowById("GALLERY_PHOTOS", "PHOTO_ID", photoId);
  if (!photo || photo.ALBUM_ID !== albumId) {
    return jsonError("Photo does not belong to this album.", "VALIDATION_ERROR");
  }
  updateRowById("GALLERY_ALBUMS", "ALBUM_ID", albumId, {
    COVER_PHOTO_ID: photoId,
    COVER_PHOTO_URL: photo.IMAGE_URL,
    UPDATED_AT: nowIso()
  });
  clearPublicCache();
  logActivity(session.user.USER_ID, "ALBUM_COVER_CHANGED", "ALBUM", albumId, photoId);
  return jsonSuccess("Album cover updated.");
}

function deleteAlbum(payload) {
  var session = validateAdminSession(payload.sessionToken);
  var albumId = sanitizeText(payload.albumId || "");
  var album = findRowById("GALLERY_ALBUMS", "ALBUM_ID", albumId);
  if (!album) {
    return jsonError("Album not found.", "NOT_FOUND");
  }
  var photos = getAlbumPhotoRows(albumId);
  photos.forEach(function (photo) {
    trashFileSafely(photo.DRIVE_FILE_ID, [album.ALBUM_FOLDER_ID]);
    deleteRowById("GALLERY_PHOTOS", "PHOTO_ID", photo.PHOTO_ID);
  });
  trashFolderSafely(album.ALBUM_FOLDER_ID, getRequiredProperty("GALLERY_FOLDER_ID"));
  deleteRowById("GALLERY_ALBUMS", "ALBUM_ID", albumId);
  clearPublicCache();
  logActivity(session.user.USER_ID, "ALBUM_DELETED", "ALBUM", albumId, album.TITLE);
  return jsonSuccess("Album and photographs deleted.");
}

function getActivityLog(payload) {
  validateAdminSession(payload.sessionToken);
  var logs = getRows("ACTIVITY_LOG")
    .sort(function (a, b) {
      return String(b.TIMESTAMP).localeCompare(String(a.TIMESTAMP));
    })
    .slice(0, 100);
  return jsonSuccess("Activity log loaded.", { logs: logs });
}

function parsePayload(e) {
  if (e && e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }
  return e && e.parameter ? e.parameter : {};
}

function verifyOrigin(payload) {
  return;
}

function validateAdminSession(token) {
  if (!token) {
    throw new Error("SESSION_EXPIRED");
  }
  var tokenHash = hashToken(token);
  var sessions = getRows("ADMIN_SESSIONS");
  var session = sessions.find(function (row) {
    return row.TOKEN_HASH === tokenHash && row.STATUS === "ACTIVE";
  });
  if (!session || new Date(session.EXPIRES_AT).getTime() < Date.now()) {
    if (session) {
      updateRowById("ADMIN_SESSIONS", "SESSION_ID", session.SESSION_ID, {
        STATUS: "EXPIRED"
      });
    }
    throw new Error("SESSION_EXPIRED");
  }
  var user = findRowById("ADMIN_USERS", "USER_ID", session.USER_ID);
  if (!user || user.STATUS !== "ACTIVE") {
    throw new Error("SESSION_EXPIRED");
  }
  updateRowById("ADMIN_SESSIONS", "SESSION_ID", session.SESSION_ID, {
    LAST_ACTIVITY: nowIso(),
    EXPIRES_AT: addHoursIso(SESSION_HOURS)
  });
  return { session: session, user: user };
}

function publicUser(user) {
  return {
    USER_ID: user.USER_ID,
    USERNAME: user.USERNAME,
    FULL_NAME: user.FULL_NAME,
    ROLE: user.ROLE,
    STATUS: user.STATUS
  };
}

function getSpreadsheet() {
  if (!CMS_SPREADSHEET_CACHE) {
    CMS_SPREADSHEET_CACHE = SpreadsheetApp.openById(
      DATABASE_SPREADSHEET_ID || getRequiredProperty("SPREADSHEET_ID")
    );
  }
  return CMS_SPREADSHEET_CACHE;
}

function ensureSheet(spreadsheet, sheetName, headers) {
  var sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
  var currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getValues()[0];
  var hasAnyHeader = currentHeaders.some(function (header) {
    return String(header || "").trim();
  });
  if (!hasAnyHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    return sheet;
  }

  var existing = {};
  currentHeaders.forEach(function (header) {
    if (header) {
      existing[String(header)] = true;
    }
  });
  var missingHeaders = headers.filter(function (header) {
    return !existing[header];
  });
  if (missingHeaders.length) {
    var startColumn = sheet.getLastColumn() + 1;
    sheet.getRange(1, startColumn, 1, missingHeaders.length).setValues([missingHeaders]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getSheet(sheetName) {
  return getSpreadsheet().getSheetByName(sheetName);
}

function getRows(sheetName) {
  var sheet = getSheet(sheetName);
  if (!sheet || sheet.getLastRow() < 2) {
    return [];
  }
  var values = sheet.getDataRange().getValues();
  var headers = values.shift();
  return values
    .filter(function (row) {
      return row.some(function (cell) {
        return cell !== "";
      });
    })
    .map(function (row) {
      var object = {};
      headers.forEach(function (header, index) {
        object[header] = row[index] instanceof Date ? dateOnly(row[index]) : row[index];
      });
      return object;
    });
}

function appendObjectRow(sheetName, object) {
  var sheet = getSheet(sheetName);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(headers.map(function (header) {
    return object[header] || "";
  }));
}

function findRowById(sheetName, idColumn, idValue) {
  return getRows(sheetName).find(function (row) {
    return String(row[idColumn]) === String(idValue);
  });
}

function updateRowById(sheetName, idColumn, idValue, updates) {
  var sheet = getSheet(sheetName);
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var idIndex = headers.indexOf(idColumn);
  for (var rowIndex = 1; rowIndex < values.length; rowIndex++) {
    if (String(values[rowIndex][idIndex]) === String(idValue)) {
      Object.keys(updates).forEach(function (key) {
        var colIndex = headers.indexOf(key);
        if (colIndex >= 0) {
          sheet.getRange(rowIndex + 1, colIndex + 1).setValue(updates[key]);
        }
      });
      return true;
    }
  }
  return false;
}

function deleteRowById(sheetName, idColumn, idValue) {
  var sheet = getSheet(sheetName);
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var idIndex = headers.indexOf(idColumn);
  for (var rowIndex = values.length - 1; rowIndex >= 1; rowIndex--) {
    if (String(values[rowIndex][idIndex]) === String(idValue)) {
      sheet.deleteRow(rowIndex + 1);
    }
  }
}

function getEventsWithPhotoCount() {
  var photos = getRows("EVENT_PHOTOS");
  return getRows("EVENTS").map(function (event) {
    event.PHOTO_COUNT = photos.filter(function (photo) {
      return photo.EVENT_ID === event.EVENT_ID;
    }).length;
    return event;
  });
}

function getAlbumsWithPhotoCount() {
  var photos = getRows("GALLERY_PHOTOS");
  return getRows("GALLERY_ALBUMS").map(function (album) {
    var storedPhotos = photos.filter(function (photo) {
      return photo.ALBUM_ID === album.ALBUM_ID;
    });
    var linkedPhotos = getSharedAlbumPhotos(album, storedPhotos);
    album.PHOTO_COUNT = mergeAlbumPhotos(storedPhotos, linkedPhotos).length;
    if (!album.COVER_PHOTO_URL && linkedPhotos.length) {
      album.COVER_PHOTO_URL = linkedPhotos[0].THUMBNAIL_URL || linkedPhotos[0].IMAGE_URL;
    }
    return album;
  });
}

function getAlbumPhotoRows(albumId, album) {
  var storedPhotos = getRows("GALLERY_PHOTOS")
    .filter(function (photo) {
      return photo.ALBUM_ID === albumId;
    })
    .sort(sortByDisplayOrder);
  album = album || findRowById("GALLERY_ALBUMS", "ALBUM_ID", albumId);
  return mergeAlbumPhotos(storedPhotos, getSharedAlbumPhotos(album, storedPhotos));
}

function mergeAlbumPhotos(storedPhotos, linkedPhotos) {
  var seen = {};
  var merged = [];
  (storedPhotos || []).forEach(function (photo) {
    var key = photo.DRIVE_FILE_ID || photo.IMAGE_URL || photo.PHOTO_ID;
    if (key) {
      seen[key] = true;
    }
    photo.SOURCE_TYPE = photo.SOURCE_TYPE || "CMS_UPLOAD";
    merged.push(photo);
  });

  (linkedPhotos || []).forEach(function (photo) {
    var key = photo.DRIVE_FILE_ID || photo.IMAGE_URL || photo.PHOTO_ID;
    if (key && seen[key]) {
      return;
    }
    if (key) {
      seen[key] = true;
    }
    merged.push(photo);
  });

  return merged.sort(sortByDisplayOrder);
}

function getSharedAlbumPhotos(album, storedPhotos) {
  if (!album || !album.DRIVE_FOLDER_URL) {
    return [];
  }

  var albumUrl = sanitizeUrl(album.DRIVE_FOLDER_URL);
  if (!albumUrl) {
    return [];
  }

  var cache = CacheService.getScriptCache();
  var cacheKey = linkedAlbumCacheKey(albumUrl);
  var cached = cache.get(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (error) {
      cache.remove(cacheKey);
    }
  }

  var photos = extractDriveFolderId(albumUrl)
    ? getDriveFolderPhotos(album, albumUrl, storedPhotos || [])
    : getGooglePhotosSharedPhotos(album, albumUrl, storedPhotos || []);

  try {
    cache.put(cacheKey, JSON.stringify(photos), 300);
  } catch (error) {
    // Large shared albums may exceed Apps Script cache size. They still work without caching.
  }
  return photos;
}

function getDriveFolderPhotos(album, albumUrl, storedPhotos) {
  var folderId = extractDriveFolderId(albumUrl);
  if (!folderId) {
    return [];
  }

  var folder;
  try {
    folder = DriveApp.getFolderById(folderId);
  } catch (error) {
    return [];
  }

  var files = folder.getFiles();
  var photos = [];
  var order = (storedPhotos || []).length + 1;
  while (files.hasNext() && photos.length < MAX_LINKED_ALBUM_IMAGES) {
    var file = files.next();
    var mimeType = file.getMimeType();
    if (!isImageMimeType(mimeType)) {
      continue;
    }

    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (error) {
      // If the script user cannot change sharing, keep using the existing public access.
    }

    photos.push(
      linkedAlbumPhoto(album, {
        sourceId: file.getId(),
        driveFileId: file.getId(),
        driveFolderId: folderId,
        fileName: file.getName(),
        mimeType: mimeType,
        imageUrl: driveImageUrl(file.getId()),
        thumbnailUrl: driveThumbnailUrl(file.getId(), "w900"),
        caption: "",
        order: order++
      })
    );
  }
  return photos;
}

function getGooglePhotosSharedPhotos(album, albumUrl, storedPhotos) {
  var response;
  try {
    response = UrlFetchApp.fetch(albumUrl, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
  } catch (error) {
    return [];
  }

  if (response.getResponseCode() >= 400) {
    return [];
  }

  var imageUrls = extractGooglePhotosImageUrls(response.getContentText());
  var order = (storedPhotos || []).length + 1;
  return imageUrls.slice(0, MAX_LINKED_ALBUM_IMAGES).map(function (imageUrl, index) {
    return linkedAlbumPhoto(album, {
      sourceId: "google-photo-" + index,
      driveFileId: "",
      driveFolderId: "",
      fileName: "google-photo-" + (index + 1) + ".jpg",
      mimeType: "image/jpeg",
      imageUrl: googlePhotoSizedUrl(imageUrl, "w1600-h1200"),
      thumbnailUrl: googlePhotoSizedUrl(imageUrl, "w900-h700"),
      caption: "",
      order: order++
    });
  });
}

function linkedAlbumPhoto(album, source) {
  var sourceId = String(source.sourceId || source.imageUrl || source.fileName || generateUniqueId("LINK"));
  return {
    PHOTO_ID:
      "LINK-" +
      album.ALBUM_ID +
      "-" +
      sourceId.replace(/[^a-zA-Z0-9]+/g, "").slice(0, 36),
    ALBUM_ID: album.ALBUM_ID,
    DRIVE_FILE_ID: source.driveFileId || "",
    DRIVE_FOLDER_ID: source.driveFolderId || "",
    FILE_NAME: source.fileName || "linked-photo.jpg",
    MIME_TYPE: source.mimeType || "image/jpeg",
    IMAGE_URL: source.imageUrl,
    THUMBNAIL_URL: source.thumbnailUrl || source.imageUrl,
    CAPTION: source.caption || "",
    PERSON_NAMES: "",
    ALT_TEXT: album.TITLE,
    DISPLAY_ORDER: source.order || 1,
    CREATED_BY: "SHARED_LINK",
    CREATED_AT: "",
    UPDATED_AT: "",
    SOURCE_TYPE: "SHARED_LINK"
  };
}

function extractDriveFolderId(url) {
  var clean = String(url || "");
  var folderMatch = clean.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) {
    return folderMatch[1];
  }
  var idMatch = clean.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) {
    return idMatch[1];
  }
  return "";
}

function extractGooglePhotosImageUrls(html) {
  var normalized = String(html || "")
    .replace(/\\u003d/g, "=")
    .replace(/\\u0026/g, "&")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&");
  var matches = normalized.match(/https:\/\/lh3\.googleusercontent\.com\/[^"'<>\\\s)]+/g) || [];
  var seen = {};
  var imageUrls = [];
  matches.forEach(function (url) {
    var clean = googlePhotoBaseUrl(url);
    if (!clean || clean.length < 80 || seen[clean]) {
      return;
    }
    seen[clean] = true;
    imageUrls.push(clean);
  });
  return imageUrls;
}

function googlePhotoBaseUrl(url) {
  var clean = String(url || "")
    .replace(/\\u003d/g, "=")
    .replace(/\\u0026/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/[",']+$/g, "");
  var slashIndex = clean.lastIndexOf("/");
  var equalsIndex = clean.indexOf("=", slashIndex);
  if (equalsIndex > 0) {
    clean = clean.slice(0, equalsIndex);
  }
  return clean;
}

function googlePhotoSizedUrl(url, size) {
  var clean = googlePhotoBaseUrl(url);
  return clean ? clean + "=" + size : "";
}

function isImageMimeType(mimeType) {
  return /^image\//i.test(String(mimeType || ""));
}

function linkedAlbumCacheKey(url) {
  return "linkedAlbum:" + Utilities.base64EncodeWebSafe(String(url || "")).slice(0, 90);
}

function getEventPhotoRows(eventId) {
  return getRows("EVENT_PHOTOS")
    .filter(function (photo) {
      return photo.EVENT_ID === eventId;
    })
    .sort(sortByDisplayOrder);
}

function sortByDisplayOrder(a, b) {
  return Number(a.DISPLAY_ORDER || 0) - Number(b.DISPLAY_ORDER || 0);
}

function saveImagePayloadToFolder(filePayload, folder) {
  var mimeType = sanitizeText(filePayload.mimeType || "");
  if (!IMAGE_TYPES[mimeType]) {
    throw new Error("Unsupported image type.");
  }
  var base64 = String(filePayload.base64Data || "").replace(/^data:[^;]+;base64,/, "");
  var bytes = Utilities.base64Decode(base64);
  if (bytes.length > MAX_IMAGE_BYTES) {
    throw new Error("Image exceeds the 8 MB size limit.");
  }
  var originalName = sanitizeText(filePayload.fileName || "photo.jpg");
  var fileName = generateUniqueId("IMG") + "-" + safeFileName(originalName);
  var blob = Utilities.newBlob(bytes, mimeType, fileName);
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return {
    fileId: file.getId(),
    fileName: fileName,
    mimeType: mimeType,
    imageUrl: driveImageUrl(file.getId()),
    thumbnailUrl: driveThumbnailUrl(file.getId())
  };
}

function trashFileSafely(fileId, allowedFolderIds) {
  if (!fileId) {
    return;
  }
  var file = DriveApp.getFileById(fileId);
  if (!isFileInAllowedFolder(file, allowedFolderIds)) {
    throw new Error("Refusing to delete a file outside the configured CMS folder.");
  }
  file.setTrashed(true);
}

function trashFolderSafely(folderId, expectedParentId) {
  if (!folderId) {
    return;
  }
  var folder = DriveApp.getFolderById(folderId);
  var parents = folder.getParents();
  var allowed = false;
  while (parents.hasNext()) {
    if (parents.next().getId() === expectedParentId) {
      allowed = true;
      break;
    }
  }
  if (!allowed) {
    throw new Error("Refusing to delete a folder outside the configured CMS folder.");
  }
  folder.setTrashed(true);
}

function isFileInAllowedFolder(file, allowedFolderIds) {
  var parents = file.getParents();
  while (parents.hasNext()) {
    var parentId = parents.next().getId();
    if (allowedFolderIds.indexOf(parentId) >= 0) {
      return true;
    }
  }
  return false;
}

function getOrCreateConfiguredFolder(props, propertyName, folderName, parentFolder) {
  var existingId = props.getProperty(propertyName);
  if (existingId) {
    return DriveApp.getFolderById(existingId);
  }
  var folder = parentFolder ? parentFolder.createFolder(folderName) : DriveApp.createFolder(folderName);
  props.setProperty(propertyName, folder.getId());
  return folder;
}

function getRequiredProperty(name) {
  var value = PropertiesService.getScriptProperties().getProperty(name);
  if (!value) {
    throw new Error("Missing Script Property: " + name);
  }
  return value;
}

function generateUniqueId(prefix) {
  return prefix + "-" + Utilities.getUuid().replace(/-/g, "").slice(0, 18).toUpperCase();
}

function generateSessionToken() {
  return Utilities.getUuid() + "." + Utilities.getUuid() + "." + Utilities.getUuid();
}

function generateUniqueSlug(sheetName, columnName, title) {
  var base = sanitizeSlug(title);
  var used = getRows(sheetName).map(function (row) {
    return row[columnName];
  });
  var slug = base;
  var counter = 2;
  while (used.indexOf(slug) >= 0) {
    slug = base + "-" + counter++;
  }
  return slug;
}

function sanitizeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || generateUniqueId("item").toLowerCase();
}

function sanitizeText(value) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, 500);
}

function sanitizeLongText(value) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, 5000);
}

function sanitizeUrl(value) {
  var clean = String(value || "").replace(/[<>]/g, "").trim();
  if (!clean) {
    return "";
  }
  var extractedUrl = clean.match(/https:\/\/[^\s)\]]+/i);
  if (extractedUrl) {
    clean = extractedUrl[0];
  }
  if (
    !/^https:\/\/drive\.google\.com\//i.test(clean) &&
    !/^https:\/\/docs\.google\.com\//i.test(clean) &&
    !/^https:\/\/photos\.app\.goo\.gl\//i.test(clean) &&
    !/^https:\/\/photos\.google\.com\//i.test(clean) &&
    !/^https:\/\/share\.google\//i.test(clean)
  ) {
    return "";
  }
  return clean.slice(0, 1000);
}

function safeFileName(value) {
  return String(value || "file")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

function normalizeStatus(value, allowed) {
  var status = String(value || "DRAFT").toUpperCase();
  return allowed.indexOf(status) >= 0 ? status : "DRAFT";
}

function hashPassword(password) {
  return hashString(String(password) + ":" + getRequiredProperty("SESSION_SECRET"));
}

function hashToken(token) {
  return hashString(String(token) + ":" + getRequiredProperty("SESSION_SECRET"));
}

function hashString(value) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    value,
    Utilities.Charset.UTF_8
  );
  return bytes.map(function (byte) {
    var value = (byte < 0 ? byte + 256 : byte).toString(16);
    return value.length === 1 ? "0" + value : value;
  }).join("");
}

function driveImageUrl(fileId) {
  return driveThumbnailUrl(fileId, "w1600");
}

function driveThumbnailUrl(fileId, size) {
  return (
    "https://drive.google.com/thumbnail?id=" +
    encodeURIComponent(fileId) +
    "&sz=" +
    encodeURIComponent(size || "w800")
  );
}

function nowIso() {
  return new Date().toISOString();
}

function addHoursIso(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function dateOnly(date) {
  return Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), "yyyy-MM-dd");
}

function logActivity(userId, action, entityType, entityId, details) {
  appendObjectRow("ACTIVITY_LOG", {
    LOG_ID: generateUniqueId("LOG"),
    USER_ID: userId,
    ACTION: action,
    ENTITY_TYPE: entityType,
    ENTITY_ID: entityId,
    DETAILS: sanitizeLongText(details || ""),
    TIMESTAMP: nowIso()
  });
}

function clearPublicCache() {
  CacheService.getScriptCache().removeAll([
    "publishedEvents",
    "upcomingEvents",
    "archivedEvents",
    "publishedAlbums"
  ]);
}

function jsonSuccess(message, data) {
  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      message: message || "OK",
      data: data || {}
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function jsonError(message, errorCode) {
  var code = errorCode || "ERROR";
  if (message === "SESSION_EXPIRED") {
    message = "Your admin session has expired. Please login again.";
    code = "SESSION_EXPIRED";
  }
  return ContentService.createTextOutput(
    JSON.stringify({
      success: false,
      message: message || "Request failed.",
      errorCode: code
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
