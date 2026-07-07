import type { Metadata } from "next";
import { AdminEventsManager } from "@/components/Admin/AdminEventsManager";
import { AdminShell } from "@/components/Admin/AdminShell";

export const metadata: Metadata = {
  title: "Manage Events"
};

export default function AdminEventsPage() {
  return (
    <AdminShell>
      <AdminEventsManager />
    </AdminShell>
  );
}
