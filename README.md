# St. Joseph's High School Website

A production-ready Next.js website for St. Joseph's High School, Borabanda, Hyderabad, with a Google Apps Script CMS for school events and gallery albums.

The public website keeps the existing school branding, pages, logo, colours, and responsive layout. The admin system is hidden behind a small footer symbol that links to `/admin`.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Google Apps Script Web App API
- Google Sheets CMS database
- Google Drive image storage
- Vercel deployment

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For the live CMS connection, copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

Do not commit `.env.local`.

## Public Routes

- `/`
- `/about`
- `/academics`
- `/facilities`
- `/admissions`
- `/events`
- `/events/upcoming`
- `/events/archive`
- `/events/[slug]`
- `/gallery`
- `/gallery/[slug]`
- `/alumni`
- `/contact`

## Admin Routes

- `/admin`
- `/admin/dashboard`
- `/admin/events`
- `/admin/events/new`
- `/admin/events/[id]/edit`
- `/admin/gallery`
- `/admin/gallery/new`
- `/admin/gallery/[id]`

## Google Sheets Setup

Create one spreadsheet for the CMS. Copy its ID from the URL:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

The Apps Script `setupCMS()` or `setupDatabase()` function creates and validates these sheets:

- `ADMIN_USERS`
- `ADMIN_SESSIONS`
- `EVENTS`
- `EVENT_PHOTOS`
- `GALLERY_ALBUMS`
- `GALLERY_PHOTOS`
- `ACTIVITY_LOG`

Events are a permanent school diary. Past events are not deleted automatically; they remain available in the archive with their photographs.

Current CMS spreadsheet ID used by `Code.gs`:

```text
1oet7lULdj8qqXTMGc9itXP7yccCpIDzDi7w9FdtRidk
```

## Google Drive Setup

Create a private parent folder such as:

```text
School Website CMS
```

Inside it, the setup creates or uses:

```text
School Website CMS/
  Events/
    Event Name Date/
  Gallery/
    Album Name Date/
```

Images are uploaded to Drive. Google Sheets stores only file IDs, folder IDs, file names, MIME types, captions, alt text, and public display URLs. Base64 is used only during upload transport and is not stored in Sheets.

For very large gallery collections, create a public Google Drive folder or Google Photos shared album and paste its link into the album's `Google Drive / Google Photos link` field in the admin form. Keep `Location` as the human-readable place, for example `St. Joseph's High School, Borabanda`.

## Apps Script Setup

1. Create a Google Apps Script project.
2. Paste `apps-script/Code.gs` into the project.
3. Open Project Settings and add these Script Properties:

```text
SPREADSHEET_ID=1oet7lULdj8qqXTMGc9itXP7yccCpIDzDi7w9FdtRidk
CMS_PARENT_FOLDER_ID=1O_Ac3lgeKZWYkNOrzR6UFir_WAB7Yj97
EVENTS_FOLDER_ID=optional_events_folder_id
GALLERY_FOLDER_ID=optional_gallery_folder_id
SESSION_SECRET=a_long_random_secret
ALLOWED_ORIGIN=https://your-vercel-domain.vercel.app
APP_NAME=St Joseph School Website CMS
```

`EVENTS_FOLDER_ID` and `GALLERY_FOLDER_ID` can be blank before running `setupCMS()`. The setup function will create missing folders and save their IDs.

4. Run `setupDatabase()` manually from the Apps Script editor. This creates the skeleton database tables and adds the default admin user to `ADMIN_USERS`.

```javascript
setupDatabase()
```

5. Deploy as a Web App:

- Execute as: `Me`
- Who has access: `Anyone`

The app still protects admin actions with its own login/session system. Public access is needed so the Vercel frontend can call the Web App URL.

6. Copy the Web App deployment URL and set it as `NEXT_PUBLIC_APPS_SCRIPT_URL` in Vercel.

Redeploy the Apps Script Web App after every backend code change.

## First Administrator

Running `setupDatabase()` creates the default admin in the `ADMIN_USERS` table:

```text
Username: admin
Password: 198917
```

The password is stored as a hash in Google Sheets; plain text passwords are not stored in Sheets. You can also run `createInitialAdmin()` from the Apps Script editor without parameters. It uses the same default login and will not create a duplicate admin if the user already exists.

Roles supported:

- `SUPER_ADMIN`
- `ADMIN`
- `EDITOR`

Only a `SUPER_ADMIN` can permanently delete an event record. Normal event controls are publish, unpublish, archive, restore, and edit.

## Event Diary Rules

- Upcoming, today's, past, and archived events are all kept.
- Event photos are append-only during normal editing.
- Changing the cover photo only changes the cover pointer.
- Existing event photos are not deleted when an event date passes.
- Each event has its own Drive folder.
- Event photo captions, optional names, alt text, order, and cover selection can be edited.

## Gallery Rules

- Albums can be created, edited, published, unpublished, and deleted.
- Each album has its own Drive folder.
- A public Google Drive folder or Google Photos shared album link can be saved on the album for large photo collections.
- Each photo can have caption, optional names, alt text, and display order.
- One photo can be selected as the album cover.
- Deleting a gallery photo moves the Drive file to Trash after folder verification.

## Vercel Deployment

1. Push the source code to GitHub with Git.
2. Import the repository in Vercel.
3. Add the environment variable:

```text
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

4. Keep the default Next.js settings.
5. Deploy.

## Build Checks

```bash
npm run typecheck
npm run build
```

## Backup and Preservation

For the permanent event archive:

- Periodically download the Google Sheet as `.xlsx`.
- Keep a copy of the `School Website CMS` Drive folder.
- Do not manually move event folders out of the configured `Events` folder.
- Restore accidentally unpublished events by changing their status back to `PUBLISHED`.
- Use academic-year filters and thumbnails as the archive grows.

## Privacy

This is a public school website. Do not publish private student records, admission numbers, parent phone numbers, home addresses, dates of birth, fee details, attendance, marks, or IDs. Photo captions and names are optional and should be used only when the school has permission.

## What To Upload

Upload the complete project source folder to GitHub with Git, not through the GitHub website. Do not upload generated folders such as `node_modules`, `.next`, `.vercel`, `dist`, `build`, `out`, or logs. They are ignored by `.gitignore`.

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Media in `public/images`, `public/icons`, `public/favicon.ico`, `public/manifest.json`, and `public/robots.txt` should be committed because the website needs those files. Future CMS-uploaded event and gallery photos are stored in Google Drive, not in the GitHub repository.

## Apps Script Limitations

- Apps Script has execution time limits, so upload photos in batches of 25 or fewer.
- Google Drive image links may take a short time to become publicly visible.
- The frontend URL must match `ALLOWED_ORIGIN` for protected write actions.
- This project uses client-side admin pages, but all write operations are protected by Apps Script session validation.
