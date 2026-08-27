import { NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function getIdFromParams(params: { id: string } | Promise<{ id: string }>) {
  const resolved = await params;
  return resolved.id;
}

// update kategori
export async function PUT(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const id = await getIdFromParams(params);
    const body = await req.json();

    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Nama dan slug wajib diisi' }, { status: 400 });
    }

    await db
      .update(categories)
      .set({
        name: body.name,
        slug: body.slug,
      })
      .where(eq(categories.id, id));

    return NextResponse.json({ success: true, message: 'Kategori berhasil diperbarui' });
  } catch (error: any) {
    console.error("PUT Category Error:", error);
    return NextResponse.json({ error: 'Gagal memperbarui kategori' }, { status: 500 });
  }
}

// delete kategori
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const id = await getIdFromParams(params);
    
    await db.delete(categories).where(eq(categories.id, id));

    return NextResponse.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json({ error: 'Gagal menghapus kategori' }, { status: 500 });
  }
}