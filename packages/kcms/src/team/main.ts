import { Controller } from './controller.js';
import { DummyRepository } from './adaptor/repository/dummyRepository';
import { OpenAPIHono } from '@hono/zod-openapi';
import { GetTeamsRoute, PostTeamsRoute } from './routing';
import { Result } from '@mikuroxina/mini-fn';
import { errorToCode } from './adaptor/errors';
import { PrismaTeamRepository } from './adaptor/repository/prismaRepository';
import { prismaClient } from '../adaptor';

export const teamHandler = new OpenAPIHono();
const isProduction = process.env.NODE_ENV === 'production';
export const controller = new Controller(
  isProduction ? new PrismaTeamRepository(prismaClient) : new DummyRepository()
);

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

teamHandler.openapi(PostTeamsRoute, async (c) => {
  const request = c.req.valid('json');

  const res = await controller.create(request);
  if (Result.isErr(res)) {
    return c.json({ description: errorToCode(res[1]) }, 400);
  }
  const teams = Result.unwrap(res);
  return c.json(teams, 200);
});
