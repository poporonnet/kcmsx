import { describe, expect, it } from 'vitest';
import { PreMatch, PreMatchID } from './pre.js';
import { EntryID } from '../../entry/entry.js';
import { RunResult, RunResultID } from './runResult.js';

describe('PreMatch', () => {
  it('正しく初期化できる', () => {
    const args = {
      id: '1' as PreMatchID,
      courseIndex: 1,
      matchIndex: 1,
      teamId1: '2' as EntryID,
      teamId2: '3' as EntryID,
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
      teamId1: '2' as EntryID,
      teamId2: '3' as EntryID,
      runResults: [...Array(2)].map((_, i) =>
        RunResult.new({
          id: String(i) as RunResultID,
          goalTimeSeconds: i * 10,
          points: 10 + i,
          teamId: i % 2 == 0 ? ('2' as EntryID) : ('3' as EntryID),
          finishState: 'FINISHED',
        })
      ),
    };
    const res = PreMatch.new(args);

    expect(res.getRunResults().length).toBe(2);
  });

  it('走行結果は0,1,2個になる', () => {
    for (let i = 0; i < 100; i++) {
      const args = {
        id: '1' as PreMatchID,
        courseIndex: 1,
        matchIndex: 1,
        teamId1: '2' as EntryID,
        teamId2: '3' as EntryID,
        runResults: [],
      };

      for (let i = 1; i < 100; i++) {
        const mainMatch = PreMatch.new(args);
        // 0,1,2以外は足せない
        if (i == 0 || i == 1 || i == 2) {
          expect(() => {
            mainMatch.appendRunResults(
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
          mainMatch.appendRunResults(
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
    }
  });

  it('走行結果はチーム1またはチーム2のもの', () => {
    const args = {
      id: '1' as PreMatchID,
      courseIndex: 1,
      matchIndex: 1,
      teamId1: '2' as EntryID,
      teamId2: '3' as EntryID,
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
            teamId: i % 2 == 0 ? args.teamId1 : ('999' as EntryID),
            finishState: 'FINISHED',
          });
        })
      )
    ).toThrowError(new Error('RunResult teamId must be teamId1 or teamId2'));
  });
});
