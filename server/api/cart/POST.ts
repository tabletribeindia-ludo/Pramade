import type { Request, Response } from 'express';

// Valid coupon codes
const COUPONS: Record<string, { type: 'percent' | 'flat'; value: number; label: string }> = {
  PRAMADE10: { type: 'percent', value: 10, label: '10% off your order' },
  PRAMADE20: { type: 'percent', value: 20, label: '20% off your order' },
  DROP004: { type: 'flat', value: 500, label: '₹500 off Drop 004' },
  FIRSTORDER: { type: 'percent', value: 15, label: '15% off your first order' },
  PRAFAM: { type: 'flat', value: 250, label: '₹250 off for the community' },
};

export default async function handler(req: Request, res: Response) {
  try {
    const { action, code } = req.body as { action?: string; code?: string };

    if (action === 'validate_coupon') {
      if (!code || typeof code !== 'string') {
        return res.status(400).json({ valid: false, error: 'Coupon code is required.' });
      }
      const normalized = code.trim().toUpperCase();
      const coupon = COUPONS[normalized];
      if (!coupon) {
        return res.status(404).json({ valid: false, error: 'Invalid coupon code.' });
      }
      return res.json({
        valid: true,
        code: normalized,
        type: coupon.type,
        value: coupon.value,
        label: coupon.label,
      });
    }

    return res.status(400).json({ error: 'Unknown action.' });
  } catch (err) {
    console.error('cart.post.error', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
