import { Option, Result } from '@mikuroxina/mini-fn';
import { config } from 'config';
import { beforeEach, describe, expect, it } from 'vitest';
import { TeamID } from '../../../team/models/team.js';
import { testRankingMainMatchData } from '../../../testData/match.js';
import { MainMatch, MainMatchID } from '../../model/main.js';
import { RunResult, RunResultID } from '../../model/runResult.js';
import { DummyMainMatchRepository } from './mainMatchRepository.js';

describe('DummyMainMatchRepository', () => {
  const repository = new DummyMainMatchRepository();

  beforeEach(() => {
    repository.clear(testRankingMainMatchData);
  });

  it('作成できる', async () => {
    const match = MainMatch.new({
      id: '900' as MainMatchID,
      courseIndex: 0,
      matchIndex: 91,
      departmentType: config.departmentTypes[0],
      teamId1: '91' as TeamID,
      teamId2: '92' as TeamID,
      winnerId: '91' as TeamID,
      runResults: [
        RunResult.new({
          id: '90' as RunResultID,
          teamID: '91' as TeamID,
          points: 12,
          goalTimeSeconds: 60,
          finishState: 'FINISHED',
        }),
        RunResult.new({
          id: '91' as RunResultID,
          teamID: '92' as TeamID,
          points: 10,
          goalTimeSeconds: 64,
          finishState: 'FINISHED',
        }),
      ],
    });
    const res = await repository.create(match);

    expect(Result.isErr(res)).toBe(false);
  });

  it.todo('取得できる', async () => {
    const res = await repository.findByID('100' as MainMatchID);
    expect(Option.isNone(res)).toBe(false);
  });

  it('更新できる', async () => {
    const match = MainMatch.new({
      id: '100' as MainMatchID,
      courseIndex: 0,
      matchIndex: 1,
      departmentType: config.departmentTypes[0],
      teamId1: '1' as TeamID,
      teamId2: '2' as TeamID,
      winnerId: '1' as TeamID,
      runResults: [
        RunResult.new({
          id: '10' as RunResultID,
          teamID: '1' as TeamID,
          points: 12,
          goalTimeSeconds: 60,
          finishState: 'FINISHED',
        }),
        RunResult.new({
          id: '11' as RunResultID,
          teamID: '2' as TeamID,
          points: 10,
          goalTimeSeconds: 64,
          finishState: 'FINISHED',
        }),
      ],
    });
    const res = await repository.update(match);
    expect(Result.isErr(res)).toBe(false);
  });

  it('全ての試合を取得できる', async () => {
    const res = await repository.findAll();
    expect(Result.isErr(res)).toBe(false);
  });
});
