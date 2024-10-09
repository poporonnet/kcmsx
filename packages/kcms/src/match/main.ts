import { MatchController } from './adaptor/controller/match';
import { GetMatchService } from './service/get';
import { PrismaPreMatchRepository } from './adaptor/prisma/preMatchRepository';
import { prismaClient } from '../adaptor';
import { DummyPreMatchRepository } from './adaptor/dummy/preMatchRepository';
import { PrismaMainMatchRepository } from './adaptor/prisma/mainMatchRepository';
import { DummyMainMatchRepository } from './adaptor/dummy/mainMatchRepository';
import { FetchTeamService } from '../team/service/get';
import { PrismaTeamRepository } from '../team/adaptor/repository/prismaRepository';
import { DummyRepository } from '../team/adaptor/repository/dummyRepository';
import { OpenAPIHono } from '@hono/zod-openapi';
import { GetMatchRoute, PostMatchGenerateRoute } from './routing';
import { Result } from '@mikuroxina/mini-fn';
import { GeneratePreMatchService } from './service/generatePre';
import { SnowflakeIDGenerator } from '../id/main';
import { GetMatchIdRoute, GetMatchRoute } from './routing';
import { PreMatchID } from './model/pre';
import { MainMatchID } from './model/main';


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
const matchController = new MatchController(
  getMatchService,
  fetchTeamService,
  generatePreMatchService
);

export const matchHandlers = new OpenAPIHono();

matchHandlers.openapi(GetMatchRoute, async (c) => {
  const res = await matchController.getAll();
  if (Result.isErr(res)) {
    return c.json({ description: res[1].message }, 400);
  }

  return c.json(res[1], 200);
});

matchHandlers.openapi(PostMatchGenerateRoute, async (c) => {
  const { matchType, departmentType } = c.req.valid('param');

  const res = await matchController.generateMatch(matchType, departmentType);
  if (Result.isErr(res)) {
    return c.json({ description: res[1].message }, 400);
  }

  return c.json(res[1], 200);
});
                      
matchHandlers.openapi(GetMatchIdRoute, async (c) => {
  const { matchType, matchID } = c.req.valid('param');

  const res = await matchController.getMatchByID(matchType, matchID as MainMatchID | PreMatchID);
  if (Result.isErr(res)) {
    const error = Result.unwrapErr(res);
    return c.json({ description: error.message }, 400);
  }

  return c.json(Result.unwrap(res), 200);
});
