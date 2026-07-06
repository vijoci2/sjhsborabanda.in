# St. Joseph's High School Website

A production-ready Next.js website for St. Joseph's High School, Borabanda, Hyderabad. It uses React, TypeScript, Tailwind CSS, App Router pages, reusable components, SEO metadata, responsive navigation, public-only sample content, UI-only enquiry forms, gallery filters, and deployable Vercel defaults.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Public image assets in `public/images`
- Vercel-ready scripts

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run typecheck
npm run build
```

## Deploy on Vercel

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Keep the default framework preset as Next.js.
4. Use `npm run build` as the build command.
5. Deploy.

## Content and Privacy

The site is designed for public information only. Do not publish private student data such as phone numbers, parent details, marks, attendance, fee details, DOB, addresses, personal records, or IDs. Connect forms only to a secure backend that follows school data policies.

## Key Routes

- `/`
- `/about`
- `/academics`
- `/facilities`
- `/admissions`
- `/news-events`
- `/gallery`
- `/alumni`
- `/contact`

## GitHub Upload

Use Git from this project root instead of uploading folders through the GitHub
website:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Do not commit `node_modules`, `.next`, `.vercel`, logs, or environment files.
They are ignored by `.gitignore`.
