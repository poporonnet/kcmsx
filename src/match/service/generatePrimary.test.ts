import { describe, expect, it } from 'vitest';
import { DummyRepository } from '../../entry/adaptor/dummyRepository.js';
import { DummyMatchRepository } from '../adaptor/dummyRepository.js';
import { Result } from '@mikuroxina/mini-fn';
import { GeneratePrimaryMatchService } from './generatePrimary.js';
import { TestEntrySet } from '../../testData/entry.js';

describe('予選の対戦表を正しく生成できる', () => {
  const repository = new DummyRepository([
    TestEntrySet.ElementaryMultiWalk['101'],
    TestEntrySet.ElementaryMultiWalk['102'],
    TestEntrySet.ElementaryMultiWalk['103'],
    TestEntrySet.ElementaryWheel['107'],
    TestEntrySet.ElementaryWheel['108'],
    TestEntrySet.ElementaryWheel['109'],
  ]);
  const matchRepository = new DummyMatchRepository();
  const service = new GeneratePrimaryMatchService(repository, matchRepository);

  it('初期状態の対戦表を生成できる', async () => {
    const res = await service.generatePrimaryMatch();
    expect(Result.isErr(res)).toStrictEqual(false);
    for (const v of Result.unwrap(res)) {
      for (const j of v) {
        expect(j.teams.left!.id).not.toBe(j.teams.right!.id);
        expect(j.teams.left!.category).toStrictEqual(j.teams.right!.category);
      }
    }
  });
});
