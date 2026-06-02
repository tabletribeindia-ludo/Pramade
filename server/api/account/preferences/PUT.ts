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

    const { notifyDrops, notifyOrders, notifyNewsletter, preferredSizes, preferredCategories } = req.body as {
      notifyDrops?: boolean;
      notifyOrders?: boolean;
      notifyNewsletter?: boolean;
      preferredSizes?: string;
      preferredCategories?: string;
    };

    const [existing] = await db.select().from(userPreferences).where(eq(userPreferences.userId, session.user.id));

    if (existing) {
      await db.update(userPreferences).set({
        notifyDrops: notifyDrops ?? existing.notifyDrops,
        notifyOrders: notifyOrders ?? existing.notifyOrders,
        notifyNewsletter: notifyNewsletter ?? existing.notifyNewsletter,
        preferredSizes: preferredSizes ?? existing.preferredSizes,
        preferredCategories: preferredCategories ?? existing.preferredCategories,
      }).where(eq(userPreferences.userId, session.user.id));
    } else {
      await db.insert(userPreferences).values({
        userId: session.user.id,
        notifyDrops: notifyDrops ?? true,
        notifyOrders: notifyOrders ?? true,
        notifyNewsletter: notifyNewsletter ?? false,
        preferredSizes: preferredSizes ?? '',
        preferredCategories: preferredCategories ?? '',
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences', message: String(error) });
  }
}
