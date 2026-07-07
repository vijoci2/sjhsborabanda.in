import type { Metadata } from "next";
import { AdminEventForm } from "@/components/Admin/AdminEventForm";
import { AdminShell } from "@/components/Admin/AdminShell";

export const metadata: Metadata = {
  title: "Edit Event"
};

type EditEventPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;

  return (
    <AdminShell>
      <AdminEventForm eventId={id} />
    </AdminShell>
  );
}
