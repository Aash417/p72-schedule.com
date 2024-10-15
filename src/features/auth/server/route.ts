import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { loginSchema, SignUpSchema } from '../schemas';

const app = new Hono()
   .post('/login', zValidator('json', loginSchema), (c) => {
      const { email, password } = c.req.valid('json');
      console.log({ email, password });

      return c.json({ success: 'ok', email, password });
   })
   .post('/register', zValidator('json', SignUpSchema), (c) => {
      const { name, email, password } = c.req.valid('json');
      console.log({ name, email, password });

      return c.json({
         success: 'ok',
         name,
         email,
         password,
      });
   });

export default app;
