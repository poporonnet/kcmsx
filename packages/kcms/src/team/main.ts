import { OpenAPIHono } from '@hono/zod-openapi';

import {
  DeleteEntryTeamRoute,
  DeleteTeamRoute,
  GetTeamRoute,
  GetTeamsRoute,
  PostEntryTeamRoute,
  PostTeamsRoute,
} from './routing';

import { Result } from '@mikuroxina/mini-fn';
import { prismaClient } from '../adaptor';
import { TeamController } from './adaptor/controller/controller';
import { errorToCode } from './adaptor/errors';
import { DummyRepository } from './adaptor/repository/dummyRepository';
import { PrismaTeamRepository } from './adaptor/repository/prismaRepository';
import { TeamID } from './models/team.js';

import { apiReference } from '@scalar/hono-api-reference';
import { SnowflakeIDGenerator } from '../id/main';
import { DummyMainMatchRepository } from '../match/adaptor/dummy/mainMatchRepository';
import { DummyPreMatchRepository } from '../match/adaptor/dummy/preMatchRepository';
import { PrismaMainMatchRepository } from '../match/adaptor/prisma/mainMatchRepository';
import { PrismaPreMatchRepository } from '../match/adaptor/prisma/preMatchRepository';
import { GetMatchService } from '../match/service/get';
import { CreateTeamService } from './service/createTeam';
import { DeleteTeamService } from './service/delete';
import { EntryService } from './service/entry';
import { FetchTeamService } from './service/get';

export const teamHandler = new OpenAPIHono();
const isProduction = process.env.NODE_ENV === 'production';
const teamRepository = isProduction
  ? new PrismaTeamRepository(prismaClient)
  : new DummyRepository();
const preMatchRepository = isProduction
  ? new PrismaPreMatchRepository(prismaClient)
  : new DummyPreMatchRepository();
const mainMatchRepository = isProduction
  ? new PrismaMainMatchRepository(prismaClient)
  : new DummyMainMatchRepository();
const idGenerator = new SnowflakeIDGenerator(1, () => BigInt(new Date().getTime()));

const getMatchService = new GetMatchService(preMatchRepository, mainMatchRepository);

const fetchTeamService = new FetchTeamService(teamRepository);
const createTeamService = new CreateTeamService(teamRepository, idGenerator);
const deleteTeamService = new DeleteTeamService(teamRepository);
const entryService = new EntryService(teamRepository, getMatchService);

export const controller = new TeamController(
  createTeamService,
  fetchTeamService,
  deleteTeamService,
  entryService
);

/**
 * すべてのチームを返す (GET /team)
 */
teamHandler.openapi(GetTeamsRoute, async (c) => {
  const res = await controller.getAll();
  if (Result.isErr(res)) {
    return c.json({ description: errorToCode(res[1]) }, 400);
  }

  return c.json(Result.unwrap(res), 200);
});

/**
 * すべてのチームを返す (POST /team)
 */
teamHandler.openapi(PostTeamsRoute, async (c) => {
  const request = c.req.valid('json');

  const res = await controller.create(request);
  if (Result.isErr(res)) {
    return c.json({ description: errorToCode(res[1]) }, 400);
  }
  const teams = Result.unwrap(res);
  return c.json(teams, 200);
});

/**
 * 指定されたIDのチームを返す (GET /team/{teamID})
 */
teamHandler.openapi(GetTeamRoute, async (c) => {
  const teamID = c.req.param('teamID');
  const res = await controller.getByID(teamID as TeamID);
  if (Result.isErr(res)) {
    return c.json({ description: errorToCode(res[1]) }, 400);
  }
  const team = Result.unwrap(res);
  return c.json(team, 200);
});

/**
 * 指定されたIDのチームを削除する (DELETE /team/{teamID})
 */
teamHandler.openapi(DeleteTeamRoute, async (c) => {
  const teamID = c.req.param('teamID');
  const res = await controller.delete(teamID as TeamID);
  if (Result.isErr(res)) {
    return c.json({ description: errorToCode(Result.unwrapErr(res)) }, 400);
  }
  return new Response(null, { status: 204 });
});

/**
 * エントリーする (POST /team/{teamID}/entry)
 */
teamHandler.openapi(PostEntryTeamRoute, async (c) => {
  const { teamID } = c.req.valid('param');
  const res = await controller.enter(teamID as TeamID);
  if (Result.isErr(res)) {
    return c.json({ description: errorToCode(Result.unwrapErr(res)) }, 400);
  }

  return new Response(null, { status: 200 });
});
/**
 * エントリーを解除する (DELETE /team/{teamID}/entry)
 */
teamHandler.openapi(DeleteEntryTeamRoute, async (c) => {
  const { teamID } = c.req.valid('param');
  const res = await controller.cancel(teamID as TeamID);
  if (Result.isErr(res)) {
    return c.json({ description: errorToCode(Result.unwrapErr(res)) }, 400);
  }
  return new Response(null, { status: 204 });
});

teamHandler.doc('/openapi/team.json', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Team API',
  },
});

teamHandler.get(
  '/reference/team',
  apiReference({
    spec: {
      url: '/openapi/team.json',
    },
  })
);
