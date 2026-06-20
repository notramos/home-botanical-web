import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/admin/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");
  if (session.user.role !== "admin") redirect("/");

  return (
    <DashboardShell title="Admin Panel">
      {children}
    </DashboardShell>
  );
}
