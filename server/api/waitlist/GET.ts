import type { Request, Response } from 'express';
import fs from 'node:fs/promises';

const DATA_FILE = '/shared-storage/public/assets/waitlist.json';

interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  drop: string;
  tier: string;
  phone?: string;
  city?: string;
  instagram?: string;
  joinedAt: string;
  ip?: string;
}

interface WaitlistStore {
  entries: WaitlistEntry[];
}

async function readStore(): Promise<WaitlistStore> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as WaitlistStore;
  } catch {
    return { entries: [] };
  }
}

export default async function handler(req: Request, res: Response) {
  try {
    const { drop, email } = req.query as { drop?: string; email?: string };

    const store = await readStore();

    // If checking a specific email's status for a drop
    if (email && drop) {
      const entry = store.entries.find(
        (e) => e.email.toLowerCase() === email.toLowerCase() && e.drop === drop
      );
      if (!entry) {
        return res.status(404).json({ registered: false });
      }
      const dropEntries = store.entries.filter((e) => e.drop === drop);
      const position = dropEntries.findIndex((e) => e.id === entry.id) + 1;
      return res.json({
        registered: true,
        position,
        total: dropEntries.length,
        tier: entry.tier,
        joinedAt: entry.joinedAt,
      });
    }

    // Public stats per drop (no PII)
    if (drop) {
      const dropEntries = store.entries.filter((e) => e.drop === drop);
      const tierCounts = dropEntries.reduce<Record<string, number>>((acc, e) => {
        acc[e.tier] = (acc[e.tier] ?? 0) + 1;
        return acc;
      }, {});
      return res.json({
        drop,
        total: dropEntries.length,
        tiers: tierCounts,
      });
    }

    // All drops summary (no PII)
    const drops = [...new Set(store.entries.map((e) => e.drop))];
    const summary = drops.map((d) => {
      const entries = store.entries.filter((e) => e.drop === d);
      return { drop: d, total: entries.length };
    });

    return res.json({ drops: summary, totalSignups: store.entries.length });
  } catch (err) {
    console.error('waitlist.get.error', err);
    return res.status(500).json({ error: 'Failed to fetch waitlist data.' });
  }
}
