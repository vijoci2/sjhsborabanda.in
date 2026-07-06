import type { Metadata } from "next";
import { GalleryGrid } from "@/components/Gallery/GalleryGrid";
import { SectionTitle } from "@/components/UI/SectionTitle";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Filtered public gallery for St. Joseph's High School campus, academics, celebrations, sports, and activities."
};

export default function GalleryPage() {
  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Gallery
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            Public campus moments, organized with simple filters for families,
            alumni, and visitors.
          </p>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="site-container">
          <SectionTitle
            title="Explore Campus Life"
            description="Filter public image categories while keeping private student information off the website."
          />
          <GalleryGrid />
        </div>
      </section>
    </>
  );
}
