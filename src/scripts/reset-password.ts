import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs"; // sesuai library di auth

async function resetPassword() {
  const hashedPassword = await bcrypt.hash("13579", 10);
  
  await db
    .update(users)
    .set({ passwordHash: hashedPassword })
    .where(eq(users.email, "admin@umkmbekasi.go.id"));

  console.log("Password admin berhasil di-reset ke: 13579");
}

resetPassword();