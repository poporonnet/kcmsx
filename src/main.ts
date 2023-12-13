/*
KCMS - Matz葉ガニロボコン 大会運営支援ツール
(C) 2023 Poporon Network & Other Contributors
MIT License.
*/
import { Hono } from "hono";
import { entryHandler } from "./entry/main.js";
import { serve } from "@hono/node-server";

const app = new Hono();

app.route("/entry", entryHandler);

serve(app, () => {
  console.log(
    "kcms\n(C) 2023 Poporon Network & Other Contributors\nMIT License.\nServer started: 3000",
  );
});
