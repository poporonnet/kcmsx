import { OpenAPIHono } from '@hono/zod-openapi';
import { Result } from '@mikuroxina/mini-fn';
import { apiReference } from '@scalar/hono-api-reference';
import { prismaClient } from '../adaptor';
import { SnowflakeIDGenerator } from '../id/main';
import { errorToCode } from '../team/adaptor/errors';
import { DummyRepository } from '../team/adaptor/repository/dummyRepository';
import { PrismaTeamRepository } from '../team/adaptor/repository/prismaRepository';
import { TeamID } from '../team/models/team';
import { FetchTeamService } from '../team/service/get';
import { MatchController } from './adaptor/controller/match';
import { DummyMainMatchRepository } from './adaptor/dummy/mainMatchRepository';
import { DummyPreMatchRepository } from './adaptor/dummy/preMatchRepository';
import { PrismaMainMatchRepository } from './adaptor/prisma/mainMatchRepository';
import { PrismaPreMatchRepository } from './adaptor/prisma/preMatchRepository';
import { Controller } from './controller';
import { MainMatchID } from './model/main';
import { PreMatchID } from './model/pre';
import { CreateRunResultArgs } from './model/runResult';
import {
  GetMatchIdRoute,
  GetMatchRoute,
  GetMatchRunResultRoute,
  GetMatchTypeRoute,
  GetRankingRoute,
  PostMatchGenerateManualRoute,
  PostMatchGenerateRoute,
  PostMatchRunResultRoute,
} from './routing';
import { CreateRunResultService } from './service/createRunResult';
import { FetchRunResultService } from './service/fetchRunResult';
import { GenerateMainMatchService } from './service/generateMain';
import { GeneratePreMatchService } from './service/generatePre';
import { GenerateRankingService } from './service/generateRanking';
import { GetMatchService } from './service/get';
import { upcase } from './utility/upcase';
const isProduction = process.env.NODE_ENV === 'production';

// Repositories
const preMatchRepository = isProduction
  ? new PrismaPreMatchRepository(prismaClient)
  : new DummyPreMatchRepository();
const mainMatchRepository = isProduction
  ? new PrismaMainMatchRepository(prismaClient)
  : new DummyMainMatchRepository();
const teamRepository = isProduction
  ? new PrismaTeamRepository(prismaClient)
  : new DummyRepository();

const idGenerator = new SnowflakeIDGenerator(1, () => BigInt(new Date().getTime()));

const createRunResultService = new CreateRunResultService(
  idGenerator,
  preMatchRepository,
  mainMatchRepository
);
const getMatchService = new GetMatchService(preMatchRepository, mainMatchRepository);
const fetchTeamService = new FetchTeamService(teamRepository);

export const controller = new Controller(createRunResultService);

const generatePreMatchService = new GeneratePreMatchService(
  fetchTeamService,
  idGenerator,
  preMatchRepository
);
const generateRankingService = new GenerateRankingService(preMatchRepository, mainMatchRepository);
const fetchRunResultService = new FetchRunResultService(mainMatchRepository, preMatchRepository);
const generateMainMatchService = new GenerateMainMatchService(mainMatchRepository, idGenerator);
const matchController = new MatchController(
  getMatchService,
  fetchTeamService,
  generatePreMatchService,
  generateRankingService,
  fetchRunResultService,
  generateMainMatchService
);
export const matchHandler = new OpenAPIHono();

matchHandler.openapi(GetMatchRoute, async (c) => {
  const res = await matchController.getAll();
  if (Result.isErr(res)) {
    return c.json({ description: res[1].message }, 400);
  }
  return c.json(res[1], 200);
});

// Post match run result route
matchHandler.openapi(PostMatchRunResultRoute, async (c) => {
  const req = c.req.valid('json');
  const { matchType, matchID } = c.req.valid('param');

  const request: Omit<CreateRunResultArgs, 'id'>[] = req.map((r) => ({
    points: r.points,
    teamID: r.teamID as TeamID,
    goalTimeSeconds: r.goalTimeSeconds ?? Infinity,
    finishState: upcase(r.finishState),
  }));
  const res = await controller.createRunResult(
    matchType,
    matchID as PreMatchID | MainMatchID,
    request
  );
  if (Result.isErr(res)) {
    return c.json({ description: errorToCode(res[1]) }, 400);
  }
  return c.json(200);
});

matchHandler.openapi(PostMatchGenerateRoute, async (c) => {
  const { matchType, departmentType } = c.req.valid('param');

  const res = await matchController.generateMatch(matchType, departmentType);
  if (Result.isErr(res)) {
    return c.json({ description: res[1].message }, 400);
  }

  return c.json(res[1], 200);
});

/**
 * 本戦試合を手動で生成
 */
matchHandler.openapi(PostMatchGenerateManualRoute, async (c) => {
  const { departmentType } = c.req.valid('param');
  const req = c.req.valid('json');

  const res = await matchController.generateMatchManual(departmentType, req.team1ID, req.team2ID);
  if (Result.isErr(res)) {
    return c.json({ description: res[1].message }, 400);
  }

  return c.json(res[1], 200);
});

matchHandler.openapi(GetMatchIdRoute, async (c) => {
  const { matchType, matchID } = c.req.valid('param');

  const res = await matchController.getMatchByID(matchType, matchID as MainMatchID | PreMatchID);
  if (Result.isErr(res)) {
    const error = Result.unwrapErr(res);
    return c.json({ description: error.message }, 400);
  }

  return c.json(Result.unwrap(res), 200);
});

matchHandler.openapi(GetMatchTypeRoute, async (c) => {
  const { matchType } = c.req.valid('param');

  const res = await matchController.getMatchByType(matchType);
  if (Result.isErr(res)) {
    const error = Result.unwrapErr(res);
    return c.json({ description: error.message }, 400);
  }
  return c.json(Result.unwrap(res), 200);
});

matchHandler.openapi(GetRankingRoute, async (c) => {
  const { matchType, departmentType } = c.req.valid('param');

  const res = await matchController.getRanking(matchType, departmentType);
  if (Result.isErr(res)) {
    const error = Result.unwrapErr(res);
    return c.json({ description: error.message }, 400);
  }
  return c.json(Result.unwrap(res), 200);
});

matchHandler.openapi(GetMatchRunResultRoute, async (c) => {
  const { matchType, matchID } = c.req.valid('param');

  const res = await matchController.getRunResultsByMatchID(
    matchType,
    matchID as MainMatchID | PreMatchID
  );
  if (Result.isErr(res)) {
    const error = Result.unwrapErr(res);
    return c.json({ description: error.message }, 400);
  }
  return c.json(Result.unwrap(res), 200);
});

matchHandler.doc('/openapi/match.json', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Match API',
  },
});

matchHandler.get(
  '/reference/match',
  apiReference({
    spec: {
      url: '/openapi/match.json',
    },
  })
);
