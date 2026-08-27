import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { hashPassword } from '@/lib/auth';

export async function POST() {
  try {
    const passwordHash = await hashPassword('bagasdxdroid');
    
    await db.insert(users).values({
      name: 'Super Admin',
      email: 'admin@bekasi.go.id',
      passwordHash,
      role: 'superadmin',
    });

    return NextResponse.json({ message: 'Admin created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Setup failed or already exists' }, { status: 400 });
  }
}