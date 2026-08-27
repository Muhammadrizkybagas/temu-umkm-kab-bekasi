"use server";

import { db } from "@/db";
import { partners, umkm, umkmPartners } from "@/db/schema";
import { logActivity } from "@/lib/logger";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const DEFAULT_PARTNERS = [
  { name: "Alfamart", logoUrl: "/partners/alfamart.svg" },
  { name: "Alfamidi", logoUrl: "/partners/alfamidi.svg" },
  { name: "Indomaret", logoUrl: "/partners/indomaret.svg" },
  { name: "Indogrosir", logoUrl: "/partners/indogrosir.svg" },
  { name: "Papaya Fresh Gallery", logoUrl: "/partners/papaya.svg" },
  { name: "Hypermart", logoUrl: "/partners/hypermart.svg" },
];

export async function getPartners() {
  const existing = await db.select().from(partners);

  
  if (existing.length !== 6) {
    await db.delete(partners);
    await db.insert(partners).values(DEFAULT_PARTNERS);
    return await db.select().from(partners);
  }

  return existing;
}


export async function getBermitraUmkms() {
  try {
    
    const rows = await db
      .select({
        umkm: umkm,
        partner: partners,
      })
      .from(umkm)
      .leftJoin(umkmPartners, eq(umkm.id, umkmPartners.umkmId))
      .leftJoin(partners, eq(umkmPartners.partnerId, partners.id))
      .where(eq(umkm.status, "Bermitra"));

      
    const umkmMap = new Map<string, any>();

    for (const row of rows) {
      if (!umkmMap.has(row.umkm.id)) {
        umkmMap.set(row.umkm.id, {
          ...row.umkm,
          partners: [],
        });
      }

      if (row.partner) {
        umkmMap.get(row.umkm.id).partners.push({
          partner: row.partner,
        });
      }
    }

    return Array.from(umkmMap.values());
  } catch (error) {
    console.error("Gagal mengambil UMKM bermitra:", error);
    return [];
  }
}


export async function updateUmkmPartnersAction(
  umkmId: string,
  partnerIds: string[],
  umkmName: string
) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(umkmPartners).where(eq(umkmPartners.umkmId, umkmId));

      if (partnerIds.length > 0) {
        await tx.insert(umkmPartners).values(
          partnerIds.map((pId) => ({
            umkmId,
            partnerId: pId,
          }))
        );
      }
    });

    await logActivity("UPDATE", `Memperbarui mitra ritel UMKM: "${umkmName}"`);

    revalidatePath("/admin/mitra");
    revalidatePath("/admin/umkm");
    return { success: true };
  } catch (error) {
    console.error("Gagal memperbarui mitra:", error);
    return { success: false, error: "Gagal memperbarui mitra UMKM." };
  }
}