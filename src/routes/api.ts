import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { createDb } from '../db';
import { 
  teams, 
  users, 
  teamMembers, 
  subscriptions, 
  webhooks, 
  invoices 
} from '../db/schema';

export const apiRouter = new Hono<{ Bindings: { DB: D1Database } }>();

// Teams
apiRouter.get('/teams', async (c) => {
  const db = createDb(c.env.DB);
  const result = await db.select().from(teams).all();
  return c.json({ success: true, data: result }, 200);
});

apiRouter.post('/teams', async (c) => {
  const db = createDb(c.env.DB);
  const { name } = await c.req.json();
  const result = await db.insert(teams).values({ name, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }).returning();
  return c.json({ success: true, data: result[0] }, 201);
});

apiRouter.get('/teams/:id', async (c) => {
  const db = createDb(c.env.DB);
  const { id } = c.req.param();
  const result = await db.select().from(teams).where(eq(teams.id, id)).get();
  if (!result) return c.json({ success: false, error: 'Team not found' }, 404);
  return c.json({ success: true, data: result }, 200);
});

apiRouter.put('/teams/:id', async (c) => {
  const db = createDb(c.env.DB);
  const { id } = c.req.param();
  const { name } = await c.req.json();
  const result = await db.update(teams).set({ name, updatedAt: new Date().toISOString() }).where(eq(teams.id, id)).returning();
  if (!result[0]) return c.json({ success: false, error: 'Team not found' }, 404);
  return c.json({ success: true, data: result[0] }, 200);
});

apiRouter.delete('/teams/:id', async (c) => {
  const db = createDb(c.env.DB);
  const { id } = c.req.param();
  await db.delete(teams).where(eq(teams.id, id));
  return c.json({ success: true }, 200);
});

// Team Members
apiRouter.get('/teams/:teamId/members', async (c) => {
  const db = createDb(c.env.DB);
  const { teamId } = c.req.param();
  const result = await db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId)).all();
  return c.json({ success: true, data: result }, 200);
});

apiRouter.post('/teams/:teamId/members', async (c) => {
  const db = createDb(c.env.DB);
  const { teamId } = c.req.param();
  const { userId, role } = await c.req.json();
  const result = await db.insert(teamMembers).values({ teamId, userId, role, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }).returning();
  return c.json({ success: true, data: result[0] }, 201);
});

apiRouter.get('/teams/:teamId/members/:id', async (c) => {
  const db = createDb(c.env.DB);
  const { teamId, id } = c.req.param();
  const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).and(eq(teamMembers.teamId, teamId)).get();
  if (!result) return c.json({ success: false, error: 'Member not found' }, 404);
  return c.json({ success: true, data: result }, 200);
});

apiRouter.put('/teams/:teamId/members/:id', async (c) => {
  const db = createDb(c.env.DB);
  const { teamId, id } = c.req.param();
  const { role } = await c.req.json();
  const result = await db.update(teamMembers).set({ role, updatedAt: new Date().toISOString() }).where(eq(teamMembers.id, id)).and(eq(teamMembers.teamId, teamId)).returning();
  if (!result[0]) return c.json({ success: false, error: 'Member not found' }, 404);
  return c.json({ success: true, data: result[0] }, 200);
});

apiRouter.delete('/teams/:teamId/members/:id', async (c) => {
  const db = createDb(c.env.DB);
  const { teamId, id } = c.req.param();
  await db.delete(teamMembers).where(eq(teamMembers.id, id)).and(eq(teamMembers.teamId, teamId));
  return c.json({ success: true }, 200);
});

// Subscriptions
apiRouter.get('/subscriptions', async (c) => {
  const db = createDb(c.env.DB);
  const result = await db.select().from(subscriptions).all();
  return c.json({ success: true, data: result }, 200);
});

apiRouter.post('/subscriptions', async (c) => {
  const db = createDb(c.env.DB);
  const { teamId, stripeSubscriptionId, stripeCustomerId } = await c.req.json();
  const result = await db.insert(subscriptions).values({ teamId, stripeSubscriptionId, stripeCustomerId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }).returning();
  return c.json({ success: true, data: result[0] }, 201);
});

apiRouter.get('/subscriptions/:id', async (c) => {
  const db = createDb(c.env.DB);
  const { id } = c.req.param();
  const result = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).get();
  if (!result) return c.json({ success: false, error: 'Subscription not found' }, 404);
  return c.json({ success: true, data: result }, 200);
});

apiRouter.put('/subscriptions/:id', async (c) => {
  const db = createDb(c.env.DB);
  const { id } = c.req.param();
  const { stripeSubscriptionId, stripeCustomerId } = await c.req.json();
  const result = await db.update(subscriptions).set({ stripeSubscriptionId, stripeCustomerId, updatedAt: new Date().toISOString() }).where(eq(subscriptions.id, id)).returning();
  if (!result[0]) return c.json({ success: false, error: 'Subscription not found' }, 404);
  return c.json({ success: true, data: result[0] }, 200);
});

apiRouter.delete('/subscriptions/:id', async (c) => {
  const db = createDb(c.env.DB);
  const { id } = c.req.param();
  await db.delete(subscriptions).where(eq(subscriptions.id, id));
  return c.json({ success: true }, 200);
});

// Webhooks
apiRouter.get('/webhooks', async (c) => {
  const db = createDb(c.env.DB);
  const result = await db.select().from(webhooks).all();
  return c.json({ success: true, data: result }, 200);
});

apiRouter.post('/webhooks', async (c) => {
  const db = createDb(c.env.DB);
  const { eventType, eventData } = await c.req.json();
  const result = await db.insert(webhooks).values({ eventType, eventData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }).returning();
  return c.json({ success: true, data: result[0] }, 201);
});

apiRouter.get('/webhooks/:id', async (c) => {
  const db = createDb(c.env.DB);
  const { id } = c.req.param();
  const result = await db.select().from(webhooks).where(eq(webhooks.id, id)).get();
  if (!result) return c.json({ success: false, error: 'Webhook not found' }, 404);
  return c.json({ success: true, data: result }, 200);
});

apiRouter.delete('/webhooks/:id', async (c) => {
  const db = createDb(c.env.DB);
  const { id } = c.req.param();
  await db.delete(webhooks).where(eq(webhooks.id, id));
  return c.json({ success: true }, 200);
});

// Invoices
apiRouter.get('/invoices', async (c) => {
  const db = createDb(c.env.DB);
  const result = await db.select().from(invoices).all();
  return c.json({ success: true, data: result }, 200);
});

apiRouter.post('/invoices', async (c) => {
  const db = createDb(c.env.DB);
  const { teamId, invoicePdf, stripeInvoiceId } = await c.req.json();
  const result = await db.insert(invoices).values({ teamId, invoicePdf, stripeInvoiceId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }).returning();
  return c.json({ success: true, data: result[0] }, 201);
});

apiRouter.get('/invoices/:id', async (c) => {
  const db = createDb(c.env.DB);
  const { id } = c.req.param();
  const result = await db.select().from(invoices).where(eq(invoices.id, id)).get();
  if (!result) return c.json({ success: false, error: 'Invoice not found' }, 404);
  return c.json({ success: true, data: result }, 200);
});

apiRouter.delete('/invoices/:id', async (c) => {
  const db = createDb(c.env.DB);
  const { id } = c.req.param();
  await db.delete(invoices).where(eq(invoices.id, id));
  return c.json({ success: true }, 200);
});