import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://st-josephs-borabanda.vercel.app"),
  title: {
    default: "St. Joseph's High School, Borabanda, Hyderabad",
    template: "%s | St. Joseph's High School"
  },
  description:
    "A modern public website for St. Joseph's High School, Borabanda, Hyderabad, with admissions, academics, facilities, news, gallery, alumni, and contact information.",
  applicationName: "St. Joseph's High School",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico"
  },
  openGraph: {
    title: "St. Joseph's High School",
    description:
      "Educating Minds. Building Character. Inspiring Futures.",
    url: "https://st-josephs-borabanda.vercel.app",
    siteName: "St. Joseph's High School",
    images: [
      {
        url: "/images/campus.jpg",
        width: 1200,
        height: 630,
        alt: "St. Joseph's High School campus"
      }
    ],
    locale: "en_IN",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
