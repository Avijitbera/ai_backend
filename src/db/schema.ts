import { drizzle } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Team schema
export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// User schema
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Team membership schema
export const teamMembers = sqliteTable('team_members', {
  id: text('id').primaryKey(),
  teamId: text('team_id').notNull().references(() => teams.id),
  userId: text('user_id').notNull().references(() => users.id),
  role: text('role').notNull().check(role => ['admin', 'member'].includes(role)),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Stripe subscription schema
export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  teamId: text('team_id').notNull().references(() => teams.id),
  stripeSubscriptionId: text('stripe_subscription_id').notNull(),
  stripeCustomerId: text('stripe_customer_id').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Stripe webhook schema
export const webhooks = sqliteTable('webhooks', {
  id: text('id').primaryKey(),
  eventType: text('event_type').notNull(),
  eventData: text('event_data').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Invoices schema
export const invoices = sqliteTable('invoices', {
  id: text('id').primaryKey(),
  teamId: text('team_id').notNull().references(() => teams.id),
  invoicePdf: text('invoice_pdf').notNull(),
  stripeInvoiceId: text('stripe_invoice_id').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});