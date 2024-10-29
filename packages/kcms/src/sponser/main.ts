import { OpenAPIHono } from '@hono/zod-openapi';
import { Result } from '@mikuroxina/mini-fn';
import { GetSponsorRoute } from './routing';
import { GetSponsorService } from './service/getsponsor';

export const sponsorHandler = new OpenAPIHono();
const getSponsorService = new GetSponsorService();

sponsorHandler.openapi(GetSponsorRoute, (c) => {
  const sponsors = getSponsorService.getInf();
  if (Result.isErr(sponsors)) {
    return c.json({ description: sponsors[1].message }, 400);
  }
  return c.json(sponsors, 200);
});
