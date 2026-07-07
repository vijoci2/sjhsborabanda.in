import type { Metadata } from "next";
import { AdminAlbumForm } from "@/components/Admin/AdminAlbumForm";
import { AdminShell } from "@/components/Admin/AdminShell";

export const metadata: Metadata = {
  title: "Add Gallery Album"
};

export default function NewGalleryAlbumPage() {
  return (
    <AdminShell>
      <AdminAlbumForm />
    </AdminShell>
  );
}
