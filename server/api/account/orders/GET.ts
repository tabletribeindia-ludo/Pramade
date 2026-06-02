import type { Request, Response } from 'express';
import { getAuth } from '@/lib/auth/auth';
import { toWebRequest } from '@/lib/auth/express-adapter';
import fs from 'node:fs';

const ORDERS_FILE = '/shared-storage/orders.json';

interface StoredOrder {
  orderId: string;
  shipping: { email: string; fullName: string; [key: string]: unknown };
  items: unknown[];
  total: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
}

export default async function handler(req: Request, res: Response) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: toWebRequest(req).headers });
    if (!session?.user) return res.status(401).json({ error: 'Unauthorized' });

    const userEmail = session.user.email;

    let orders: StoredOrder[] = [];
    if (fs.existsSync(ORDERS_FILE)) {
      const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
      const all = JSON.parse(raw) as StoredOrder[];
      orders = all.filter((o) => o.shipping?.email === userEmail);
    }

    // Sort newest first
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', message: String(error) });
  }
}
