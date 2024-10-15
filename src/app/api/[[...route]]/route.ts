import { Hono } from 'hono';
import { handle } from 'hono/vercel';

const app = new Hono().basePath('/api');

app.get('/hello/:id', (c) => {
   const { id } = c.req.param();

   return c.json({
      message: 'Hello Next.js!',
      id,
   });
});

export const GET = handle(app);
