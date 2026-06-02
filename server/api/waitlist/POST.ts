import type { Request, Response } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';

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

async function writeStore(store: WaitlistStore): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

export default async function handler(req: Request, res: Response) {
  try {
    const { email, name, drop, tier, phone, city, instagram } = req.body as Partial<WaitlistEntry>;

    // Validate required fields
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }
    if (!drop || typeof drop !== 'string') {
      return res.status(400).json({ error: 'Drop identifier is required.' });
    }

    const store = await readStore();

    // Check for duplicate email per drop
    const existing = store.entries.find(
      (e) => e.email.toLowerCase() === email.toLowerCase() && e.drop === drop
    );
    if (existing) {
      return res.status(409).json({
        error: 'already_registered',
        message: "You're already on the waitlist for this drop.",
        joinedAt: existing.joinedAt,
      });
    }

    const entry: WaitlistEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      email: email.toLowerCase().trim(),
      name: name?.trim(),
      drop: drop.trim(),
      tier: tier?.trim() || 'standard',
      phone: phone?.trim(),
      city: city?.trim(),
      instagram: instagram?.trim(),
      joinedAt: new Date().toISOString(),
      ip: req.ip,
    };

    store.entries.push(entry);
    await writeStore(store);

    // Determine position (1-indexed)
    const dropEntries = store.entries.filter((e) => e.drop === drop);
    const position = dropEntries.findIndex((e) => e.id === entry.id) + 1;

    return res.status(201).json({
      success: true,
      message: "You're on the list.",
      position,
      total: dropEntries.length,
      tier: entry.tier,
      joinedAt: entry.joinedAt,
    });
  } catch (err) {
    console.error('waitlist.post.error', err);
    return res.status(500).json({ error: 'Failed to join waitlist. Please try again.' });
  }
}
