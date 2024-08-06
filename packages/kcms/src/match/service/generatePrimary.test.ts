import { describe, expect, it } from 'vitest';
import { DummyRepository } from '../../entry/adaptor/dummyRepository.js';
import { Result } from '@mikuroxina/mini-fn';
import { GeneratePrimaryMatchService } from './generatePrimary.js';
import { TestEntrySet } from '../../testData/entry.js';
import { SnowflakeIDGenerator } from '../../id/main.js';
import { DummyPreMatchRepository } from '../adaptor/dummy/preMatchRepository.js';

describe('予選の対戦表を正しく生成できる', () => {
  const repository = new DummyRepository([
    TestEntrySet.ElementaryMultiWalk['101'],
    TestEntrySet.ElementaryMultiWalk['102'],
    TestEntrySet.ElementaryMultiWalk['103'],
    TestEntrySet.ElementaryWheel['107'],
    TestEntrySet.ElementaryWheel['108'],
    TestEntrySet.ElementaryWheel['109'],
  ]);
  const matchRepository = new DummyPreMatchRepository();
  const idGenerator = new SnowflakeIDGenerator(1, () => BigInt(new Date().getTime()));
  const service = new GeneratePrimaryMatchService(repository, matchRepository, idGenerator);

  it('初期状態の対戦表を生成できる', async () => {
    const res = await service.generatePrimaryMatch();
    expect(Result.isErr(res)).toStrictEqual(false);
    for (const v of Result.unwrap(res)) {
      for (const j of v) {
        expect(j.getTeamId1()).not.toBe(j.getTeamId2());
      }
    }
  });
});

describe('GeneratePrimaryMatchService', () => {
  it.todo('対戦表を生成できる');

  it.todo('各部門の参加者数が0の時はエラーを返す');

  it.todo('同じチームの試合は連続しない');

  it.todo('同じコースで試合をする相手は全て同じ部門になる');

  it.todo('あるチームが2回とも1人試合にならないようにする');

  it.todo('2回の対戦で相手は異なるようにする');

  it.todo('全てのチームは必ず左/右をそれぞれ走る');

  it.todo('1人試合が生じるとき、必ず3戦以降にする');

  it.todo('1人試合が生じるとき、そのチームは左側(teamId1)に配置される');

  it.todo('コースの試合数は均等にする');
});
