import { describe, expect, it } from 'vitest';
import { PreMatch, PreMatchID } from './pre.js';
import { TeamID } from '../../team/models/team.js';
import { RunResult, RunResultID } from './runResult.js';

describe('PreMatch', () => {
  it('正しく初期化できる', () => {
    const args = {
      id: '1' as PreMatchID,
      courseIndex: 1,
      matchIndex: 1,
      teamId1: '2' as TeamID,
      teamId2: '3' as TeamID,
      runResults: [],
    };
    const res = PreMatch.new(args);

    expect(res.getId()).toBe(args.id);
    expect(res.getCourseIndex()).toBe(args.courseIndex);
    expect(res.getMatchIndex()).toBe(args.matchIndex);
    expect(res.getTeamId1()).toBe(args.teamId1);
    expect(res.getTeamId2()).toBe(args.teamId2);
    expect(res.getRunResults()).toBe(args.runResults);
  });

  it('走行結果を追加できる', () => {
    const args = {
      id: '1' as PreMatchID,
      courseIndex: 1,
      matchIndex: 1,
      teamId1: '2' as TeamID,
      teamId2: '3' as TeamID,
      runResults: [...Array(2)].map((_, i) =>
        RunResult.new({
          id: String(i) as RunResultID,
          goalTimeSeconds: i * 10,
          points: 10 + i,
          teamId: i % 2 == 0 ? ('2' as TeamID) : ('3' as TeamID),
          finishState: 'FINISHED',
        })
      ),
    };
    const res = PreMatch.new(args);

    expect(res.getRunResults().length).toBe(2);
  });

  it('走行結果は0,1,2個になる', () => {
    const args = {
      id: '1' as PreMatchID,
      courseIndex: 1,
      matchIndex: 1,
      teamId1: '2' as TeamID,
      teamId2: '3' as TeamID,
      runResults: [],
    };

    for (let i = 1; i < 100; i++) {
      const preMatch = PreMatch.new(args);
      // 1,2以外は足せない
      if (i == 1 || i == 2) {
        expect(() => {
          preMatch.appendRunResults(
            [...Array(i)].map((_, i) => {
              return RunResult.new({
                id: String(i) as RunResultID,
                goalTimeSeconds: i * 10,
                points: 10 + i,
                teamId: i % 2 == 0 ? args.teamId1 : args.teamId2,
                finishState: 'FINISHED',
              });
            })
          );
        }).not.toThrow(new Error('RunResult length must be 1 or 2'));
        continue;
      }
      expect(() => {
        preMatch.appendRunResults(
          [...Array(i)].map((_, i) => {
            return RunResult.new({
              id: String(i) as RunResultID,
              goalTimeSeconds: i * 10,
              points: 10 + i,
              teamId: i % 2 == 0 ? args.teamId1 : args.teamId2,
              finishState: 'FINISHED',
            });
          })
        );
      }).toThrow(new Error('RunResult length must be 1 or 2'));
    }
  });

  it('走行結果はチーム1またはチーム2のもの', () => {
    const args = {
      id: '1' as PreMatchID,
      courseIndex: 1,
      matchIndex: 1,
      teamId1: '2' as TeamID,
      teamId2: '3' as TeamID,
      runResults: [],
    };
    const res = PreMatch.new(args);

    expect(() =>
      res.appendRunResults(
        [...Array(2)].map((_, i) => {
          return RunResult.new({
            id: String(i) as RunResultID,
            goalTimeSeconds: i * 10,
            points: 10 + i,
            teamId: i % 2 == 0 ? args.teamId1 : ('999' as TeamID),
            finishState: 'FINISHED',
          });
        })
      )
    ).toThrowError(new Error('RunResult teamId must be teamId1 or teamId2'));
  });
});
