import { db } from '@/db';
import { partners } from '@/db/schema';

export async function seedPartners() {
  const initialPartners = [
    { name: 'Alfamart', logoUrl: '/partners/alfamart.svg' },
    { name: 'Alfamidi', logoUrl: '/partners/alfamidi.svg' },
    { name: 'Indomaret', logoUrl: '/partners/indomaret.svg' },
    { name: 'Indogrosir', logoUrl: '/partners/indogrosir.svg' },
    { name: 'Papaya Fresh Gallery', logoUrl: '/partners/papaya.svg' },
    { name: 'Hypermart', logoUrl: '/partners/hypermart.svg' },
  ];

  for (const partner of initialPartners) {
    await db.insert(partners).values(partner).onConflictDoNothing();
  }
}