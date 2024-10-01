import { OpenAPIHono } from '@hono/zod-openapi';
import { Result } from '@mikuroxina/mini-fn';
import { DummyRepository } from './adaptor/dummyRepository';
import { Controller } from './controller';
import { GetTeamsRoute } from './routing';

export const teamHandler = new OpenAPIHono();
export const controller = new Controller(new DummyRepository());

teamHandler.openapi(GetTeamsRoute, async (c) => {
  const res = await controller.get();
  if (Result.isErr(res)) {
    return c.json({ description: res[1].message }, 400);
  }

  return c.json(Result.unwrap(res), 200);
});
