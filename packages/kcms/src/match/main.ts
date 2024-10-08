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
import { MainMatchID } from './model/main';
import { PreMatchID } from './model/pre';
import { CreateRunResultArgs } from './model/runResult';
import { PostMatchRunResultRoute } from './routing';
import { CreateRunResultService } from './service/createRunResult';
import { finishStateConversion } from './utility/finishStateConversion';

export const matchHandler = new OpenAPIHono();
const isProduction = process.env.NODE_ENV === 'production';
const preMatchRepository = isProduction
  ? new PrismaPreMatchRepository(prismaClient)
  : new DummyPreMatchRepository();
const mainMatchRepository = isProduction
  ? new PrismaMainMatchRepository(prismaClient)
  : new DummyMainMatchRepository();
const idGenerator = new SnowflakeIDGenerator(1, () => BigInt(new Date().getTime()));

const createRunResult = new CreateRunResultService(
  idGenerator,
  preMatchRepository,
  mainMatchRepository
);

export const controller = new Controller(createRunResult);
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
