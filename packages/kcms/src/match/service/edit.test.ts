import { describe, expect, it } from 'vitest';
import { DummyMainMatchRepository } from '../adaptor/dummy/mainMatchRepository.js';
import { EditMatchService } from './edit.js';
import { MatchID, Match } from '../model/match.js';
import { Result } from '@mikuroxina/mini-fn';
import { TestEntryData } from '../../testData/entry.js';
import { TeamID } from '../../entry/models/team.js';

describe('EditMatch', () => {
  const reporitory = new DummyMainMatchRepository();
  reporitory.create(
    Match.reconstruct({
      id: '123' as MatchID,
      teams: {
        left: TestEntryData['ElementaryMultiWalk'],
        right: TestEntryData['ElementaryWheel'],
      },
      matchType: 'primary',
      courseIndex: 0,
    })
  );
  const editService = new EditMatchService(reporitory);

  it('正しく更新できる', async () => {
    const res = await editService.handle('123', {
      results: {
        left: {
          teamID: '1' as TeamID,
          points: 2,
          time: 100,
        },
        right: {
          teamID: '2' as TeamID,
          points: 3,
          time: 200,
        },
      },
    });

    expect(Result.isErr(res)).toBe(false);
    if (Result.isErr(res)) return;
    expect(res[1].results).toStrictEqual({
      left: {
        teamID: '1',
        points: 2,
        time: 100,
      },
      right: {
        teamID: '2',
        points: 3,
        time: 200,
      },
    });
  });
});
