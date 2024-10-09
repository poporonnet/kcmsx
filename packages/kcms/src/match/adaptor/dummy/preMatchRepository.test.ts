import { describe, it, expect, beforeEach } from 'vitest';
import { testRankingPreMatchData } from '../../../testData/match.js';
import { PreMatch, PreMatchID } from '../../model/pre.js';
import { RunResult, RunResultID } from '../../model/runResult.js';
import { TeamID } from '../../../team/models/team.js';
import { Option, Result } from '@mikuroxina/mini-fn';
import { DummyPreMatchRepository } from './preMatchRepository.js';
import { config } from 'config';

describe('DummyPreMatchRepository', () => {
  const repository = new DummyPreMatchRepository();

  beforeEach(() => {
    repository.clear([...testRankingPreMatchData]);
  });

  it('作成できる', async () => {
    const match = PreMatch.new({
      id: '900' as PreMatchID,
      courseIndex: 0,
      matchIndex: 91,
      teamId1: '91' as TeamID,
      teamId2: '92' as TeamID,
      departmentType: config.departments[0].type,
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

  it('取得できる', async () => {
    const res = await repository.findByID('100' as PreMatchID);
    expect(Option.isNone(res)).toBe(false);
  });

  it('更新できる', async () => {
    const match = PreMatch.new({
      id: '100' as PreMatchID,
      courseIndex: 0,
      matchIndex: 1,
      teamId1: '1' as TeamID,
      teamId2: '2' as TeamID,
      departmentType: config.departments[0].type,
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
