import { OpenAPIHono } from '@hono/zod-openapi';
import { Result } from '@mikuroxina/mini-fn';
import { prismaClient } from '../adaptor';
import { SnowflakeIDGenerator } from '../id/main';
import { DummyRepository } from '../team/adaptor/repository/dummyRepository';
import { PrismaTeamRepository } from '../team/adaptor/repository/prismaRepository';
import { FetchTeamService } from '../team/service/get';
import { MatchController } from './adaptor/controller/match';
import { DummyMainMatchRepository } from './adaptor/dummy/mainMatchRepository';
import { DummyPreMatchRepository } from './adaptor/dummy/preMatchRepository';
import { PrismaMainMatchRepository } from './adaptor/prisma/mainMatchRepository';
import { PrismaPreMatchRepository } from './adaptor/prisma/preMatchRepository';
import { MainMatchID } from './model/main';
import { PreMatchID } from './model/pre';
import {
  GetMatchIdRoute,
  GetMatchRoute,
  GetMatchTypeRoute,
  GetRankingRoute,
  PostMatchGenerateRoute,
} from './routing';
import { GeneratePreMatchService } from './service/generatePre';
import { GenerateRankingService } from './service/generateRanking';
import { GetMatchService } from './service/get';

const isProduction = process.env.NODE_ENV === 'production';
const preMatchRepository = isProduction
  ? new PrismaPreMatchRepository(prismaClient)
  : new DummyPreMatchRepository();
const mainMatchRepository = isProduction
  ? new PrismaMainMatchRepository(prismaClient)
  : new DummyMainMatchRepository();
const teamRepository = isProduction
  ? new PrismaTeamRepository(prismaClient)
  : new DummyRepository();

const getMatchService = new GetMatchService(preMatchRepository, mainMatchRepository);
const fetchTeamService = new FetchTeamService(teamRepository);
const idGenerator = new SnowflakeIDGenerator(1, () => BigInt(new Date().getTime()));
const generatePreMatchService = new GeneratePreMatchService(
  fetchTeamService,
  idGenerator,
  preMatchRepository
);
const generateRankingService = new GenerateRankingService(preMatchRepository);
const matchController = new MatchController(
  getMatchService,
  fetchTeamService,
  generatePreMatchService,
  generateRankingService
);

export const matchHandler = new OpenAPIHono();

matchHandler.openapi(GetMatchRoute, async (c) => {
  const res = await matchController.getAll();
  if (Result.isErr(res)) {
    return c.json({ description: res[1].message }, 400);
  }

  return c.json(res[1], 200);
});

matchHandler.openapi(PostMatchGenerateRoute, async (c) => {
  const { matchType, departmentType } = c.req.valid('param');

  const res = await matchController.generateMatch(matchType, departmentType);
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
