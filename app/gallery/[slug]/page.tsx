import type { Metadata } from "next";
import { PublicGalleryAlbumDetail } from "@/components/CMS/PublicGallery";

export const metadata: Metadata = {
  title: "Gallery Album"
};

type GalleryAlbumPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GalleryAlbumPage({ params }: GalleryAlbumPageProps) {
  const { slug } = await params;

  return (
    <>
      <section className="bg-navy py-20 text-white">
        <div className="site-container max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Gallery Album
          </h1>
          <p className="mt-6 text-xl leading-8 text-white/78">
            Public photographs from school activities and campus life.
          </p>
        </div>
      </section>

      <section className="section-y bg-mist">
        <div className="site-container">
          <PublicGalleryAlbumDetail slug={slug} />
        </div>
      </section>
    </>
  );
}
