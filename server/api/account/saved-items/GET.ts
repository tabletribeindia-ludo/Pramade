import type { Request, Response } from 'express';
import { getAuth } from '@/lib/auth/auth';
import { toWebRequest } from '@/lib/auth/express-adapter';
import { db } from '@/server/db/client';
import { savedItems } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: toWebRequest(req).headers });
    if (!session?.user) return res.status(401).json({ error: 'Unauthorized' });

    const items = await db.select().from(savedItems).where(eq(savedItems.userId, session.user.id));
    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch saved items', message: String(error) });
  }
}
