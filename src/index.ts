import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { apiRouter } from './routes/api';

const app = new Hono<{ Bindings: { DB: D1Database; R2: R2Bucket } }>();

app.use('*', cors({ origin: ['http://localhost:4001', 'http://localhost:5001'] }));

app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    service: 'Multi-Tenant SaaS Backend',
    timestamp: new Date().toISOString(),
  });
});

app.route('/api', apiRouter);

app.notFound((c) => {
  return c.json({ success: false, error: 'Route not found' }, 404);
});

app.onError((err, c) => {
  return c.json({ success: false, error: err.message }, 500);
});

export default app;