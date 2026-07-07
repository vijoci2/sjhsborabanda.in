import type { Metadata } from "next";
import { AdminGalleryManager } from "@/components/Admin/AdminGalleryManager";
import { AdminShell } from "@/components/Admin/AdminShell";

export const metadata: Metadata = {
  title: "Manage Gallery"
};

export default function AdminGalleryPage() {
  return (
    <AdminShell>
      <AdminGalleryManager />
    </AdminShell>
  );
}
