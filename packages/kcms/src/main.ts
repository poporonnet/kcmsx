/*
KCMS - Matz葉ガニロボコン 大会運営支援ツール
(C) 2023-2024 Poporon Network & Other Contributors
MIT License.
*/
import { Hono } from 'hono';
import { teamHandler } from './team/main.js';
import { cors } from 'hono/cors';
import { matchHandler } from './match/main';

const app = new Hono();

app.use('*', cors());
app.route('/', teamHandler);
app.route('/', matchHandler);

// ToDo: config packageのTS読み込み問題により、一時的にBunで直接TSを実行する形に変更した
export default {
  port: 3000,
  fetch: app.fetch,
};
