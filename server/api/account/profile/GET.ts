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

    const [profile] = await db.select().from(user).where(eq(user.id, session.user.id));
    if (!profile) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      image: profile.image,
      createdAt: profile.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile', message: String(error) });
  }
}
