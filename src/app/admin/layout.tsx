import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminAuthProvider } from "@/components/admin/admin-auth";

// Never indexed, in demo or launch builds. Not in the sitemap either.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
