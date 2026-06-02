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

    const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    await db
      .delete(savedItems)
      .where(and(eq(savedItems.id, id), eq(savedItems.userId, session.user.id)));

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove saved item', message: String(error) });
  }
}
