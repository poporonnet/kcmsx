import { Hono } from 'hono';
import { GenerateFinalMatchService } from './service/generateFinal.js';
import { JSONMatchRepository } from './adaptor/json.js';
import { JSONEntryRepository } from '../entry/adaptor/json.js';
import { MatchController } from './controller.js';
import { Result } from '@mikuroxina/mini-fn';
import { EditMatchService } from './service/edit.js';
import { ReconstructMatchArgs } from './match.js';
import { GetMatchService } from './service/get.js';
import { GenerateRankingService } from './service/generateRanking.js';
import { GeneratePrimaryMatchService } from './service/generatePrimary.js';
import { SnowflakeIDGenerator } from '../id/main.js';

export const matchHandler = new Hono();
const repository = await JSONMatchRepository.new();
const entryRepository = await JSONEntryRepository.new();
const idGenerator = new SnowflakeIDGenerator(1, () => BigInt(new Date().getTime()));
const generateService = new GenerateFinalMatchService(
  entryRepository,
  repository,
  new GenerateRankingService(repository),
  idGenerator
);
const editService = new EditMatchService(repository);
const getService = new GetMatchService(repository);
const primaryService = new GeneratePrimaryMatchService(entryRepository, repository, idGenerator);
const controller = new MatchController(generateService, editService, getService, primaryService);
matchHandler.get('/:type', async (c) => {
  const { type } = c.req.param();
  const res = await controller.getMatchByType(type);
  if (Result.isErr(res)) {
    return c.json([{ error: res[1].message }], 400);
  }
  return c.json(res[1]);
});

matchHandler.put('/:match', async (c) => {
  const { match } = c.req.param();
  const req = (await c.req.json()) as Required<Pick<ReconstructMatchArgs, 'results'>>;
  if (!req.results) {
    return c.json([{ error: 'results is required' }], 400);
  }

  const res = await controller.editMatch(match, req);
  if (Result.isErr(res)) {
    return c.json([{ error: res[1].message }]);
  }

  return c.json(res[1]);
});

matchHandler.post('/:type/:category', async (c) => {
  /*
  例:
  (elementary, primary) -> 小学生部門 予選対戦表を生成
  (elementary, final) -> 小学生部門 決勝トーナメントを生成
  (open, primary) -> エラー
  (open, final) -> オープン部門 決勝トーナメントを生成

   */
  const { type, category } = c.req.param();
  const res = await controller.generateMatch(type, category);
  if (Result.isErr(res)) {
    return c.json([{ error: res[1].message }], 400);
  }

  return c.json(res[1]);
});
