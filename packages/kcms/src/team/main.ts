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
import { PrismaTeamRepository } from './adaptor/repository/prismaRepository';
import { TeamID } from './models/team.js';

import { apiReference } from '@scalar/hono-api-reference';
import { SnowflakeIDGenerator } from '../id/main';
import { PrismaMainMatchRepository } from '../match/adaptor/prisma/mainMatchRepository';
import { PrismaPreMatchRepository } from '../match/adaptor/prisma/preMatchRepository';
import { GetMatchService } from '../match/service/get';
import { CreateTeamService } from './service/createTeam';
import { DeleteTeamService } from './service/delete';
import { EntryService } from './service/entry';
import { FetchTeamService } from './service/fetchTeam';
import { EntryCodeService } from './service/entryCode';

export const teamHandler = new OpenAPIHono();

const teamRepository = new PrismaTeamRepository(prismaClient);
const preMatchRepository = new PrismaPreMatchRepository(prismaClient);
const mainMatchRepository = new PrismaMainMatchRepository(prismaClient);

const idGenerator = new SnowflakeIDGenerator(1, () => BigInt(new Date().getTime()));

const getMatchService = new GetMatchService(preMatchRepository, mainMatchRepository);

const fetchTeamService = new FetchTeamService(teamRepository);
const createTeamService = new CreateTeamService(teamRepository, idGenerator);
const deleteTeamService = new DeleteTeamService(teamRepository);
const entryService = new EntryService(teamRepository, getMatchService);
const entryCodeService = new EntryCodeService(teamRepository);

export const controller = new TeamController(
  createTeamService,
  fetchTeamService,
  deleteTeamService,
  entryService,
  entryCodeService
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
 * 初回のエントリー時にゼッケン番号を割り当てる
 */
teamHandler.openapi(PostEntryTeamRoute, async (c) => {
  const { teamID } = c.req.valid('param');
  const entry_res = await controller.enter(teamID as TeamID);
  if (Result.isErr(entry_res)) {
    return c.json({ description: errorToCode(Result.unwrapErr(entry_res)) }, 400);
  }
  const entry_code_res = await controller.assignEntryCode(teamID as TeamID);
  if (Result.isErr(entry_code_res)) {
    return c.json({ description: errorToCode(Result.unwrapErr(entry_code_res)) }, 400);
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
