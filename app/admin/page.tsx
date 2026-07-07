import type { Metadata } from "next";
import { AdminLogin } from "@/components/Admin/AdminLogin";

export const metadata: Metadata = {
  title: "Administration",
  description: "Secure website administration for St. Joseph's High School."
};

export default function AdminPage() {
  return <AdminLogin />;
}
