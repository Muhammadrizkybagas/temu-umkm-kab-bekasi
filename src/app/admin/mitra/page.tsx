import { getPartners, getBermitraUmkms } from "./actions";
import MitraClient from "./MitraClient";

export const revalidate = 0; 

export default async function MitraPage() {
  const [partners, umkms] = await Promise.all([
    getPartners(),
    getBermitraUmkms(),
  ]);

  return <MitraClient initialPartners={partners} initialUmkms={umkms} />;
}