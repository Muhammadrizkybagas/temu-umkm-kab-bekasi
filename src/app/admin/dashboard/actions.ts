import { db } from "@/db";
import { umkm, partners, umkmPartners } from "@/db/schema";
import { sql, count } from "drizzle-orm";

export async function getDashboardStats() {
  // get data sebaran UMKM per mitra
  const partnerStats = await db
    .select({
      partnerName: partners.name,
      logoUrl: partners.logoUrl,
      totalUmkm: count(umkmPartners.umkmId),
    })
    .from(partners)
    .leftJoin(umkmPartners, sql`${partners.id} = ${umkmPartners.partnerId}`)
    .groupBy(partners.id, partners.name, partners.logoUrl);

  // get data sebaran UMKM per kecamatan
  const districtStats = await db
    .select({
      district: umkm.district,
      total: count(umkm.id),
    })
    .from(umkm)
    .groupBy(umkm.district);

  return {
    partnerStats,
    districtStats,
  };
}