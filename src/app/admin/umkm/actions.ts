"use server";

import { db } from "@/db";
import { umkm, umkmPartners } from "@/db/schema"; 
import { logActivity } from "@/lib/logger";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export async function getUmkms() {
  const result = await db.query.umkm.findMany({
    orderBy: (t, { desc }) => [desc(t.id)], 
    with: {
      partners: {
        with: { partner: true },
      },
    },
  });

  return result.map((item: any) => ({
    ...item,
    logo: item.logo || item.logoUrl || item.imageUrl || null,
  }));
}

// get detail
export async function getUmkmById(id: string) {
  const result = await db.query.umkm.findFirst({
    where: eq(umkm.id, id),
    with: { partners: true },
  });

  if (!result) return null;

  return {
    ...result,
    partnerIds: result.partners.map((p) => p.partnerId),
  };
}

// naik kelas
export async function toggleNaikKelasStatus(id: string, isNaikKelas: boolean, name: string) {
  try {
    await db
      .update(umkm)
      .set({ isNaikKelas: Boolean(isNaikKelas) })
      .where(eq(umkm.id, id));

    const statusLabel = isNaikKelas ? "Naik Kelas" : "Reguler";
    await logActivity("UPDATE", `Mengubah status UMKM "${name}" menjadi ${statusLabel}`);

    revalidatePath("/admin/umkm");
    return { success: true };
  } catch (error) {
    console.error("Gagal mengubah status Naik Kelas:", error);
    return { success: false, error: "Gagal memperbarui status Naik Kelas." };
  }
}

// kemitraan
export async function toggleStatusKemitraan(id: string, status: string | number, name: string) {
  try {
    let statusValue = "Inkubator";
    if (status === "Bermitra" || status === 1 || status === "1") {
      statusValue = "Bermitra";
    }

    await db
      .update(umkm)
      .set({ status: statusValue })
      .where(eq(umkm.id, id));

    await logActivity("UPDATE", `Mengubah status kemitraan UMKM "${name}" menjadi ${statusValue}`);

    revalidatePath("/admin/umkm");
    revalidatePath("/admin/mitra");
    return { success: true };
  } catch (error) {
    console.error("Gagal mengubah status kemitraan:", error);
    return { success: false, error: "Gagal memperbarui status kemitraan." };
  }
}

export const toggleUmkmStatus = toggleStatusKemitraan;

// add umkm
export async function createUmkm(payload: Record<string, any>) {
  try {
    const { partnerIds = [], ...umkmData } = payload;

    
    const sanitizedData = {
      name: umkmData.name,
      ownerName: umkmData.ownerName,
      phone: umkmData.phone,
      district: umkmData.district,
      village: umkmData.village || "-",
      address: umkmData.address || "-",
      logoUrl: umkmData.logoUrl || null,
      coverUrl: umkmData.coverUrl || null,
      description: umkmData.description || null,
      status: umkmData.status || "Inkubator",
      isNaikKelas: Boolean(umkmData.isNaikKelas),
      isFeatured: Boolean(umkmData.isFeatured),
    };

    const newUmkm = await db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(umkm)
        .values(sanitizedData as typeof umkm.$inferInsert)
        .returning();

        
      if (
        Array.isArray(partnerIds) &&
        partnerIds.length > 0 &&
        sanitizedData.status === "Bermitra"
      ) {
        await tx.insert(umkmPartners).values(
          partnerIds.map((partnerId: string) => ({
            umkmId: inserted.id,
            partnerId,
          }))
        );
      }
      return inserted;
    });

    await logActivity("CREATE", `Menambahkan UMKM baru: "${sanitizedData.name || 'Tanpa Nama'}"`);
    revalidatePath("/admin/umkm");
    return { success: true, data: newUmkm };
  } catch (error) {
    console.error("Gagal menambah UMKM:", error);
    return { success: false, error: "Gagal menambahkan UMKM baru." };
  }
}


export async function updateUmkm(id: string, payload: Record<string, any>) {
  try {
    const { partnerIds, ...umkmData } = payload;

    const sanitizedData: Record<string, any> = {};
    if (umkmData.name !== undefined) sanitizedData.name = umkmData.name;
    if (umkmData.ownerName !== undefined) sanitizedData.ownerName = umkmData.ownerName;
    if (umkmData.phone !== undefined) sanitizedData.phone = umkmData.phone;
    if (umkmData.district !== undefined) sanitizedData.district = umkmData.district;
    if (umkmData.village !== undefined) sanitizedData.village = umkmData.village;
    if (umkmData.address !== undefined) sanitizedData.address = umkmData.address;
    if (umkmData.logoUrl !== undefined) sanitizedData.logoUrl = umkmData.logoUrl || null;
    if (umkmData.coverUrl !== undefined) sanitizedData.coverUrl = umkmData.coverUrl || null;
    if (umkmData.description !== undefined) sanitizedData.description = umkmData.description || null;
    if (umkmData.status !== undefined) sanitizedData.status = umkmData.status;
    if (umkmData.isNaikKelas !== undefined) sanitizedData.isNaikKelas = Boolean(umkmData.isNaikKelas);
    if (umkmData.isFeatured !== undefined) sanitizedData.isFeatured = Boolean(umkmData.isFeatured);

    await db.transaction(async (tx) => {
      await tx
        .update(umkm)
        .set(sanitizedData)
        .where(eq(umkm.id, id));

      if (Array.isArray(partnerIds)) {
        await tx.delete(umkmPartners).where(eq(umkmPartners.umkmId, id));
        if (partnerIds.length > 0 && sanitizedData.status === "Bermitra") {
          await tx.insert(umkmPartners).values(
            partnerIds.map((partnerId: string) => ({
              umkmId: id,
              partnerId,
            }))
          );
        }
      }
    });

    await logActivity("UPDATE", `Mengubah data UMKM: "${sanitizedData.name || id}"`);
    revalidatePath("/admin/umkm");
    revalidatePath(`/admin/umkm/edit/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Gagal memperbarui UMKM:", error);
    return { success: false, error: "Gagal memperbarui data UMKM." };
  }
}

// hapus umkm
export async function deleteUmkm(id: string, name: string) {
  try {
    await db.delete(umkm).where(eq(umkm.id, id));
    await logActivity("DELETE", `Menghapus UMKM: "${name}"`);
    revalidatePath("/admin/umkm");
    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus UMKM:", error);
    return { success: false, error: "Gagal menghapus data UMKM." };
  }
}