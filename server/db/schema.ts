/**
 * Drizzle ORM schema — PRAMADE
 *
 * Tables:
 *  - BetterAuth core: user, session, account, verification
 *  - App-specific: savedItems, userPreferences
 *
 * After modifying this file:
 * 1. Run: npm run db:generate
 * 2. Run: npm run db:migrate
 */

import {
  mysqlTable,
  varchar,
  text,
  boolean,
  timestamp,
  int,
} from 'drizzle-orm/mysql-core';

// ─── BetterAuth core tables ───────────────────────────────────────────────────

export const user = mysqlTable('user', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  isAdmin: boolean('is_admin').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export const session = mysqlTable('session', {
  id: varchar('id', { length: 36 }).primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = mysqlTable('account', {
  id: varchar('id', { length: 36 }).primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export const verification = mysqlTable('verification', {
  id: varchar('id', { length: 36 }).primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ─── App-specific tables ──────────────────────────────────────────────────────

export const savedItems = mysqlTable('saved_items', {
  id: int('id').primaryKey().autoincrement(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  productId: varchar('product_id', { length: 100 }).notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  productPrice: int('product_price').notNull(), // paise
  productImage: text('product_image'),
  productCategory: varchar('product_category', { length: 100 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const userPreferences = mysqlTable('user_preferences', {
  id: int('id').primaryKey().autoincrement(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  // Notification preferences
  notifyDrops: boolean('notify_drops').notNull().default(true),
  notifyOrders: boolean('notify_orders').notNull().default(true),
  notifyNewsletter: boolean('notify_newsletter').notNull().default(false),
  // Style preferences
  preferredSizes: varchar('preferred_sizes', { length: 100 }), // comma-separated e.g. "M,L"
  preferredCategories: varchar('preferred_categories', { length: 255 }), // comma-separated
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type SavedItem = typeof savedItems.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
