import { OpenAPIHono } from '@hono/zod-openapi';
import { Result } from '@mikuroxina/mini-fn';
import { SponsorController } from './adaptor/controller/sponsor';
import { GetSponsorRoute } from './routing';

export const sponsorHandler = new OpenAPIHono();
const sponsorController = new SponsorController();

sponsorHandler.openapi(GetSponsorRoute, (c) => {
  const sponsors = sponsorController.getAll();
  if (Result.isErr(sponsors)) return c.json({ description: sponsors[1].message }, 400);
  return c.json(Result.unwrap(sponsors), 200);
});
