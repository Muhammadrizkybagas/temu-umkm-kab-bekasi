import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    
    const token = cookieStore.get("token")?.value || cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ message: "Belum terautentikasi" }, { status: 401 });
    }
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string; name?: string; email?: string };

    return NextResponse.json({
      role: decoded.role,
      name: decoded.name,
      email: decoded.email,
    });

  } catch (error) {
    return NextResponse.json({ message: "Token tidak valid" }, { status: 401 });
  }
}