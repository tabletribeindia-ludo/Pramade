import type { Request, Response } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_FILE = '/shared-storage/public/assets/orders.json';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  shipping: ShippingAddress;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  couponCode?: string;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

interface OrderStore {
  orders: Order[];
}

async function readStore(): Promise<OrderStore> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as OrderStore;
  } catch {
    return { orders: [] };
  }
}

async function writeStore(store: OrderStore): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PRM-${ts}-${rand}`;
}

export default async function handler(req: Request, res: Response) {
  try {
    const { items, shipping, subtotal, discount, shippingCost, total, couponCode, paymentMethod } =
      req.body as Partial<Order & { couponCode?: string }>;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }
    if (!shipping?.email || !shipping?.fullName || !shipping?.phone) {
      return res.status(400).json({ error: 'Shipping details are incomplete.' });
    }
    if (!shipping?.line1 || !shipping?.city || !shipping?.state || !shipping?.pincode) {
      return res.status(400).json({ error: 'Shipping address is incomplete.' });
    }
    if (typeof total !== 'number' || total <= 0) {
      return res.status(400).json({ error: 'Invalid order total.' });
    }

    const store = await readStore();
    const order: Order = {
      orderId: generateOrderId(),
      items,
      shipping,
      subtotal: subtotal ?? 0,
      discount: discount ?? 0,
      shippingCost: shippingCost ?? 0,
      total,
      couponCode,
      paymentMethod: paymentMethod ?? 'cod',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    store.orders.push(order);
    await writeStore(store);

    return res.status(201).json({
      success: true,
      orderId: order.orderId,
      status: order.status,
      estimatedDelivery: '5–7 business days',
      createdAt: order.createdAt,
    });
  } catch (err) {
    console.error('orders.post.error', err);
    return res.status(500).json({ error: 'Failed to place order. Please try again.' });
  }
}
