import { describe, expect, it } from 'vitest';
import { GenerateMatchService } from './generate.js';
import { DummyRepository } from '../../entry/adaptor/dummyRepository.js';
import { Entry } from '../../entry/entry.js';
import { Result } from '@mikuroxina/mini-fn';
import { DummyMatchRepository } from '../adaptor/dummyRepository.js';

const generateDummyData = (n: number): Entry[] => {
  const res: Entry[] = Array<Entry>();

  for (let i = 0; i < n; i++) {
    res.push(
      Entry.new({
        id: `${i + 1}`,
        teamName: `チーム ${i + 1}`,
        members: [`チーム${i + 1}のメンバー1`],
        isMultiWalk: true,
        // 1~8がOpen, 9~16がElementary
        category: i < 8 ? 'Open' : 'Elementary',
      })
    );
  }
  return res;
};

describe('予選の対戦表を正しく生成できる', () => {
  const repository = new DummyRepository();
  const matchRepository = new DummyMatchRepository();
  const service = new GenerateMatchService(repository, matchRepository);
  const dummyData = generateDummyData(32);
  console.log(dummyData.length);
  dummyData.map((v) => repository.create(v));

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
