import type { Request, Response } from 'express';
import { getAuth } from '@/lib/auth/auth';
import { toWebRequest } from '@/lib/auth/express-adapter';
import { db } from '@/server/db/client';
import { savedItems } from '@/server/db/schema';
import { eq, and } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: toWebRequest(req).headers });
    if (!session?.user) return res.status(401).json({ error: 'Unauthorized' });

    const { productId, productName, productPrice, productImage, productCategory } = req.body as {
      productId: string;
      productName: string;
      productPrice: number;
      productImage?: string;
      productCategory?: string;
    };

    if (!productId || !productName || !productPrice) {
      return res.status(400).json({ error: 'productId, productName, and productPrice are required' });
    }

    // Prevent duplicates
    const [existing] = await db
      .select()
      .from(savedItems)
      .where(and(eq(savedItems.userId, session.user.id), eq(savedItems.productId, productId)));

    if (existing) return res.status(409).json({ error: 'Item already saved' });

    await db.insert(savedItems).values({
      userId: session.user.id,
      productId,
      productName,
      productPrice,
      productImage: productImage ?? null,
      productCategory: productCategory ?? null,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save item', message: String(error) });
  }
}
