import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://sjhsborabanda.in"),
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
    url: "https://sjhsborabanda.in",
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
        <a href="#main-content" className="sr-only z-[100] bg-white p-4 text-navy focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
