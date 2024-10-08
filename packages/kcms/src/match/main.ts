import { OpenAPIHono } from '@hono/zod-openapi';
import { Result } from '@mikuroxina/mini-fn';
import { prismaClient } from '../adaptor';
import { SnowflakeIDGenerator } from '../id/main';
import { errorToCode } from '../team/adaptor/errors';
import { TeamID } from '../team/models/team';
import { DummyMainMatchRepository } from './adaptor/dummy/mainMatchRepository';
import { DummyPreMatchRepository } from './adaptor/dummy/preMatchRepository';
import { PrismaMainMatchRepository } from './adaptor/prisma/mainMatchRepository';
import { PrismaPreMatchRepository } from './adaptor/prisma/preMatchRepository';
import { Controller } from './controller';
import { MatchController } from './adaptor/controller/match';
import { GetMatchService } from './service/get';
import { FetchTeamService } from '../team/service/get';
import { PrismaTeamRepository } from '../team/adaptor/repository/prismaRepository';
import { DummyRepository } from '../team/adaptor/repository/dummyRepository';
import { MainMatchID } from './model/main';
import { PreMatchID } from './model/pre';
import { CreateRunResultArgs } from './model/runResult';
import { PostMatchRunResultRoute, GetMatchRoute } from './routing';
import { CreateRunResultService } from './service/createRunResult';
import { finishStateConversion } from './utility/finishStateConversion';

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

// Services
const createRunResultService = new CreateRunResultService(
  idGenerator,
  preMatchRepository,
  mainMatchRepository
);
const getMatchService = new GetMatchService(preMatchRepository, mainMatchRepository);
const fetchTeamService = new FetchTeamService(teamRepository);

// Controllers
export const controller = new Controller(createRunResultService);
const matchController = new MatchController(getMatchService, fetchTeamService);

// Handlers
export const matchHandler = new OpenAPIHono();

// Get match route
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
    finishState: finishStateConversion(r.finishState),
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
