import { config } from 'config';
import { describe, expect, it } from 'vitest';
import { TeamID } from '../../team/models/team.js';
import { PreMatch, PreMatchID } from './pre.js';
import { RunResult, RunResultID } from './runResult.js';

describe('PreMatch', () => {
  it('正しく初期化できる', () => {
    const args = {
      id: '1' as PreMatchID,
      courseIndex: 1,
      matchIndex: 1,
      departmentType: config.departments[0].type,
      teamID1: '2' as TeamID,
      teamID2: '3' as TeamID,
      runResults: [],
    };
    const res = PreMatch.new(args);

    expect(res.getID()).toBe(args.id);
    expect(res.getCourseIndex()).toBe(args.courseIndex);
    expect(res.getMatchIndex()).toBe(args.matchIndex);
    expect(res.getTeamID1()).toBe(args.teamID1);
    expect(res.getTeamID2()).toBe(args.teamID2);
    expect(res.getRunResults()).toBe(args.runResults);
  });

  it('走行結果を追加できる', () => {
    const args = {
      id: '1' as PreMatchID,
      courseIndex: 1,
      matchIndex: 1,
      departmentType: config.departments[0].type,
      teamID1: '2' as TeamID,
      teamID2: '3' as TeamID,
      runResults: [...Array(2)].map((_, i) =>
        RunResult.new({
          id: String(i) as RunResultID,
          goalTimeSeconds: i * 10,
          points: 10 + i,
          teamID: i % 2 == 0 ? ('2' as TeamID) : ('3' as TeamID),
          finishState: 'FINISHED',
        })
      ),
    };
    const res = PreMatch.new(args);

    expect(res.getRunResults().length).toBe(2);
  });

  it('走行結果は0,1,2個になる', () => {
    for (let i = 1; i < 100; i++) {
      const preMatch = PreMatch.new({
        id: '1' as PreMatchID,
        courseIndex: 1,
        matchIndex: 1,
        departmentType: config.departments[0].type,
        teamID1: '2' as TeamID,
        teamID2: '3' as TeamID,
        runResults: [],
      });
      // 1,2以外は足せない
      if (i == 1 || i == 2) {
        expect(() => {
          preMatch.appendRunResults(
            [...Array(i)].map((_, i) => {
              return RunResult.new({
                id: String(i) as RunResultID,
                goalTimeSeconds: i * 10,
                points: 10 + i,
                teamID: i % 2 == 0 ? ('2' as TeamID) : ('3' as TeamID),
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
              teamID: i % 2 == 0 ? ('2' as TeamID) : ('3' as TeamID),
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
      departmentType: config.departments[0].type,
      teamID1: '2' as TeamID,
      teamID2: '3' as TeamID,
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
            teamID: '999' as TeamID,
            finishState: 'FINISHED',
          });
        })
      )
    ).toThrowError(new Error('RunResult teamID must be teamID1 or teamID2'));
  });
});
