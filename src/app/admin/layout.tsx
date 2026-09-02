import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const decoded = verifyToken(token) as { id?: string; role?: string } | null;
  if (!decoded?.id) {
    redirect("/admin/login");
  }

  const userList = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, decoded.id));

  const currentUser = userList[0];

  if (!currentUser) {
    redirect("/admin/login");
  }

  return (
    <AdminSidebar user={currentUser} userRole={currentUser.role}>
      {children}
    </AdminSidebar>
  );
}