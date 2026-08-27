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
    redirect("/login");
  }

  const decoded = verifyToken(token) as { id?: string; role?: string } | null;
  if (!decoded?.id) {
    redirect("/login");
  }

  const currentUser = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, decoded.id))
    .get();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <AdminSidebar user={currentUser} userRole={currentUser.role}>
      <main>{children}</main>
    </AdminSidebar>
  );
}