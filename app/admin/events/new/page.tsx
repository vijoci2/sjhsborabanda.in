import type { Metadata } from "next";
import { AdminEventForm } from "@/components/Admin/AdminEventForm";
import { AdminShell } from "@/components/Admin/AdminShell";

export const metadata: Metadata = {
  title: "Add Event"
};

export default function NewEventPage() {
  return (
    <AdminShell>
      <AdminEventForm />
    </AdminShell>
  );
}
