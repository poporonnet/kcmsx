/*
KCMS - Matz葉ガニロボコン 大会運営支援ツール
(C) 2023 Poporon Network & Other Contributors
MIT License.
*/
import { Hono } from 'hono';
import { entryHandler } from './entry/main.js';
import { cors } from 'hono/cors';
import { matchHandler } from './match/main.js';

const app = new Hono();

app.use('*', cors());
app.route('/entry', entryHandler);
app.route('/match', matchHandler);

export default {
  port: 3000,
  fetch: app.fetch,
};
