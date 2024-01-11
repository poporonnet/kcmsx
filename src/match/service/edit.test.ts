import { describe, expect, it } from 'vitest';
import { DummyMatchRepository } from '../adaptor/dummyRepository.js';
import { EditMatchService } from './edit.js';
import { Match } from '../match.js';
import { Result } from '@mikuroxina/mini-fn';
import { TestEntryData } from '../../testData/entry.js';

describe('EditMatch', () => {
  const reporitory = new DummyMatchRepository();
  reporitory.create(
    Match.reconstruct({
      id: '123',
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
          teamID: '1',
          points: 2,
          time: 100,
        },
        right: {
          teamID: '2',
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
