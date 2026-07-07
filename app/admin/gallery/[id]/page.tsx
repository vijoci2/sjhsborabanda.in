import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminAlbumDetail } from "@/components/Admin/AdminAlbumDetail";
import { AdminShell } from "@/components/Admin/AdminShell";

export const metadata: Metadata = {
  title: "Manage Album"
};

type AdminAlbumPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminAlbumPage({ params }: AdminAlbumPageProps) {
  const { id } = await params;

  return (
    <AdminShell>
      <Suspense
        fallback={
          <div className="rounded-lg bg-white p-6 text-navy shadow-sm">
            Loading album...
          </div>
        }
      >
        <AdminAlbumDetail albumId={id} />
      </Suspense>
    </AdminShell>
  );
}
