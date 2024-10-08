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
import { GetMatchRoute } from './routing';
import { Result } from '@mikuroxina/mini-fn';

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
const matchController = new MatchController(getMatchService, fetchTeamService);

export const matchHandlers = new OpenAPIHono();

matchHandlers.openapi(GetMatchRoute, async (c) => {
  const res = await matchController.getAllMatch();
  if (Result.isErr(res)) {
    return c.json({ description: res[1].message }, 400);
  }

  return c.json(res[1], 200);
});
