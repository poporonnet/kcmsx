import { Result } from '@mikuroxina/mini-fn';
import { beforeEach, describe, expect, it } from 'vitest';
import { testRankingPreMatchData } from '../../testData/match.js';
import { DummyMainMatchRepository } from '../adaptor/dummy/mainMatchRepository.js';
import { DummyPreMatchRepository } from '../adaptor/dummy/preMatchRepository.js';
import { PreMatchID } from '../model/pre.js';
import { GetMatchService } from './get.js';

describe('GetMatchService', () => {
  const mainMatchRepository = new DummyMainMatchRepository();
  const preMatchRepository = new DummyPreMatchRepository();

  const service = new GetMatchService(preMatchRepository, mainMatchRepository);

  beforeEach(() => {
    preMatchRepository.clear(testRankingPreMatchData);
  });

  it('取得できる(PreMatch)', async () => {
    const res = await service.findByID('100' as PreMatchID);

    expect(Result.isErr(res)).toStrictEqual(false);
    expect(res[1]).toStrictEqual(testRankingPreMatchData[0]);
  });

  it.todo('取得できる(MainMatch)');

  it('存在しないときはエラー', async () => {
    const res = await service.findByID('222' as PreMatchID);

    expect(Result.isErr(res)).toStrictEqual(true);
    expect(res[1]).toStrictEqual(new Error('Not found'));
  });

  it('全ての予選試合を取得できる', async () => {
    const res = await service.findAllPreMatch();

    expect(Result.isErr(res)).toStrictEqual(false);
    expect(res[1]).toStrictEqual(testRankingPreMatchData);
  });

  it.todo('全ての本戦試合を取得できる');

  it('全ての試合を取得できる', async () => {
    const res = await service.findAll();
    expect(Result.isErr(res)).toStrictEqual(false);
    expect(Result.unwrap(res).pre).toStrictEqual(testRankingPreMatchData);

    // ToDo: 本戦試合の取得
  });
});
