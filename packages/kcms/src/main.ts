/*
KCMS - Matz葉ガニロボコン 大会運営支援ツール
(C) 2023-2024 Poporon Network & Other Contributors
MIT License.
*/
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { entryHandler } from './entry/main.js';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors());
app.route('/entry', entryHandler);

serve(app, (p) => {
  console.log(`server started at http://${p.address}:${p.port}`);
});
