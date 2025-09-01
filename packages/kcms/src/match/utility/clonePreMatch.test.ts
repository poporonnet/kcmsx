import { config } from 'config';
import { describe, expect, it } from 'vitest';
import { TeamID } from '../../team/models/team';
import { PreMatch, PreMatchID } from '../model/pre';
import { RunResult, RunResultID } from '../model/runResult';
import { clonePreMatch } from './clonePreMatch';

describe('clonePreMatch', () => {
  const from = PreMatch.new({
    id: '123' as PreMatchID,
    courseIndex: 1,
    matchIndex: 1,
    teamID1: '456' as TeamID,
    teamID2: '789' as TeamID,
    runResults: [...Array(2)].map((_, i) =>
      RunResult.new({
        id: String(i) as RunResultID,
        goalTimeSeconds: i * 10,
        points: 10 + i,
        teamID: i % 2 == 0 ? ('456' as TeamID) : ('789' as TeamID),
        finishState: 'FINISHED',
      })
    ),
    departmentType: config.departmentTypes[0],
  });

  it('正しいインスタンスを複製できる - 値が等しい', () => {
    const cloned = clonePreMatch(from);

    expect(from).toStrictEqual(cloned);
  });

  it('正しいインスタンスを複製できる - 参照が異なる', () => {
    const cloned = clonePreMatch(from);

    expect(from).not.toBe(cloned);
  });
});
