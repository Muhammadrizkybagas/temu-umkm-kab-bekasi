import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import UserManagementClient from "./UserManagementClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  
  const data = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return <UserManagementClient initialUsers={data} />;
}