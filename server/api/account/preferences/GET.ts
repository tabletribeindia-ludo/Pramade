import type { Request, Response } from 'express';
import { getAuth } from '@/lib/auth/auth';
import { toWebRequest } from '@/lib/auth/express-adapter';
import { db } from '@/server/db/client';
import { userPreferences } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: toWebRequest(req).headers });
    if (!session?.user) return res.status(401).json({ error: 'Unauthorized' });

    const [prefs] = await db.select().from(userPreferences).where(eq(userPreferences.userId, session.user.id));

    // Return defaults if not yet set
    res.json(prefs ?? {
      notifyDrops: true,
      notifyOrders: true,
      notifyNewsletter: false,
      preferredSizes: '',
      preferredCategories: '',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch preferences', message: String(error) });
  }
}
