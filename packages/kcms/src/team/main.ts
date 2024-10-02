import { Controller } from './controller.js';
import { DummyRepository } from './adaptor/repository/dummyRepository';
import { OpenAPIHono } from '@hono/zod-openapi';
import { GetTeamsRoute } from './routing';
import { Result } from '@mikuroxina/mini-fn';
import { errorToCode } from './adaptor/errors';

export const teamHandler = new OpenAPIHono();
export const controller = new Controller(new DummyRepository());

/**
 * すべてのチームを返す (GET /team)
 */
teamHandler.openapi(GetTeamsRoute, async (c) => {
  const res = await controller.get();
  if (Result.isErr(res)) {
    return c.json({ description: errorToCode(res[1]) }, 400);
  }

  return c.json(Result.unwrap(res), 200);
});
