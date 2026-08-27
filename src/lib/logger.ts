import { db } from "@/db";
import { activityLogs } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function logActivity(
  action: "CREATE" | "UPDATE" | "DELETE" | "AUTH",
  description: string
) {
  try {
    
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    let userName = "Admin Utama";
    let userEmail = "admin@bekasikab.go.id";

    if (token) {
      
      const decoded = verifyToken(token) as { 
        name?: string; 
        email?: string; 
        role?: string 
      } | null;

      if (decoded) {
        if (decoded.name) userName = decoded.name;
        if (decoded.email) userEmail = decoded.email;
        
        if (decoded.role) {
          userName = `${userName} (${decoded.role})`;
        }
      }
    }

    await db.insert(activityLogs).values({
      userName,
      userEmail,
      action,
      description,
    });
  } catch (error) {
    console.error("Gagal menyimpan activity log:", error);
  }
}