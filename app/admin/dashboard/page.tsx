import type { Metadata } from "next";
import { AdminDashboard } from "@/components/Admin/AdminDashboard";
import { AdminShell } from "@/components/Admin/AdminShell";

export const metadata: Metadata = {
  title: "Admin Dashboard"
};

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <AdminDashboard />
    </AdminShell>
  );
}
