import type { Request, Response } from 'express';
import { getAuth } from '@/lib/auth/auth';
import { toWebRequest } from '@/lib/auth/express-adapter';
import { db } from '@/server/db/client';
import { user } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: toWebRequest(req).headers });
    if (!session?.user) return res.status(401).json({ error: 'Unauthorized' });

    const { name } = req.body as { name?: string };
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

    await db.update(user).set({ name: name.trim() }).where(eq(user.id, session.user.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile', message: String(error) });
  }
}
