import { describe, expect, it } from 'vitest';
import { FetchRunResultService } from './fetchRunResult';
import { DummyMainMatchRepository } from '../adaptor/dummy/mainMatchRepository';
import { DummyPreMatchRepository } from '../adaptor/dummy/preMatchRepository';
import { testRankingMainMatchData, testRankingPreMatchData } from '../../testData/match';
import { MainMatchID } from '../model/main';
import { PreMatchID } from '../model/pre';
import { Result } from '@mikuroxina/mini-fn';

describe('FetchRunResultService', () => {
  const dummyMainMatchRepository = new DummyMainMatchRepository(testRankingMainMatchData);
  const dummyPreMatchRepository = new DummyPreMatchRepository(testRankingPreMatchData);
  const fetchRunResultService = new FetchRunResultService(
    dummyMainMatchRepository,
    dummyPreMatchRepository
  );
  it('MainMatchの走行結果が取得できる', async () => {
    const res = await fetchRunResultService.handle('main', '900' as MainMatchID);
    expect(Result.isErr(res)).toBe(false);
    const mainMatch = Result.unwrap(res);
    expect(mainMatch).toStrictEqual(testRankingMainMatchData[0].getRunResults());
  });
  it('PreMatchの走行結果が取得できる', async () => {
    const res = await fetchRunResultService.handle('pre', '100' as PreMatchID);
    expect(Result.isErr(res)).toBe(false);
    const preMatch = Result.unwrap(res);
    expect(preMatch).toStrictEqual(testRankingPreMatchData[0].getRunResults());
  });
  it('MainMatchの走行結果が無ければエラーを返す', async () => {
    const res = await fetchRunResultService.handle('main', '0' as MainMatchID);
    expect(Result.isErr(res)).toBe(true);
  });
  it('PreMatchの走行結果が無ければエラーを返す', async () => {
    const res = await fetchRunResultService.handle('pre', '0' as PreMatchID);
    expect(Result.isErr(res)).toBe(true);
  });
});
