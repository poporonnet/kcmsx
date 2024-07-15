import { describe, expect, it } from 'vitest';
import { MainMatch, MainMatchID } from './main.js';
import { EntryID } from '../../entry/entry.js';
import { RunResult, RunResultID } from './runResult.js';

describe('MainMatch', () => {
  it('正しく初期化できる', () => {
    const args = {
      id: '1' as MainMatchID,
      courseIndex: 1,
      matchIndex: 1,
      teamId1: '2' as EntryID,
      teamId2: '3' as EntryID,
      winnerId: '2' as EntryID,
      runResults: [],
    };

    const res = MainMatch.new(args);
    expect(res.getId()).toBe(args.id);
    expect(res.getCourseIndex()).toBe(args.courseIndex);
    expect(res.getMatchIndex()).toBe(args.matchIndex);
    expect(res.getTeamId1()).toBe(args.teamId1);
    expect(res.getTeamId2()).toBe(args.teamId2);
    expect(res.getWinnerId()).toBe(args.winnerId);
    expect(res.getRunResults()).toBe(args.runResults);
  });

  it('走行結果は0 or 2 or 4になる', () => {
    const args = {
      id: '1' as MainMatchID,
      courseIndex: 1,
      matchIndex: 1,
      teamId1: '2' as EntryID,
      teamId2: '3' as EntryID,
      winnerId: '2' as EntryID,
      runResults: [],
    };

    for (let j = 1; j < 100; j++) {
      const mainMatch = MainMatch.new(args);
      // 2か4以外は足せない
      if (j == 2 || j == 4) {
        expect(() => {
          mainMatch.appendRunResults(
            [...Array(j)].map((_, i) => {
              return RunResult.new({
                id: String(i) as RunResultID,
                goalTimeSeconds: i * 10,
                points: 10 + i,
                teamId: i % 2 == 0 ? args.teamId1 : args.teamId2,
                finishState: 'FINISHED',
              });
            })
          );
        }).not.toThrow(new Error('RunResult length must be 2 or 4'));
        continue;
      }
      expect(() => {
        mainMatch.appendRunResults(
          [...Array(j)].map((_, i) => {
            return RunResult.new({
              id: String(i) as RunResultID,
              goalTimeSeconds: i * 10,
              points: 10 + i,
              teamId: i % 2 == 0 ? args.teamId1 : args.teamId2,
              finishState: 'FINISHED',
            });
          })
        );
      }).toThrow(new Error('RunResult length must be 2 or 4'));
    }
  });

  it('勝者を指定できる', () => {
    const args = {
      id: '1' as MainMatchID,
      courseIndex: 1,
      matchIndex: 1,
      teamId1: '2' as EntryID,
      teamId2: '3' as EntryID,
      runResults: [...Array(4)].map((_, i) =>
        RunResult.new({
          id: String(i) as RunResultID,
          goalTimeSeconds: i * 10,
          points: 10 + i,
          teamId: i % 2 == 0 ? ('2' as EntryID) : ('3' as EntryID),
          finishState: 'FINISHED',
        })
      ),
    };

    const mainMatch = MainMatch.new(args);

    expect(() => mainMatch.setWinnerId('2' as EntryID)).not.toThrow(
      new Error('WinnerId is already set')
    );
  });

  it('勝者が決まっているときは変更できない', () => {
    const args = {
      id: '1' as MainMatchID,
      courseIndex: 1,
      matchIndex: 1,
      teamId1: '2' as EntryID,
      teamId2: '3' as EntryID,
      winnerId: '2' as EntryID,
      runResults: [...Array(4)].map((_, i) => {
        return RunResult.new({
          id: String(i) as RunResultID,
          goalTimeSeconds: i * 10,
          points: 10 + i,
          teamId: i % 2 == 0 ? ('2' as EntryID) : ('3' as EntryID),
          finishState: 'FINISHED',
        });
      }),
    };

    const mainMatch = MainMatch.new(args);

    expect(() => mainMatch.setWinnerId('2' as EntryID)).toThrowError(
      new Error('WinnerId is already set')
    );
  });

  it('試合が終わっていないときは設定できない', () => {
    const args = {
      id: '1' as MainMatchID,
      courseIndex: 1,
      matchIndex: 1,
      teamId1: '2' as EntryID,
      teamId2: '3' as EntryID,
      runResults: [...Array(2)].map((_, i) => {
        return RunResult.new({
          id: String(i) as RunResultID,
          goalTimeSeconds: i * 10,
          points: 10 + i,
          teamId: i % 2 == 0 ? ('2' as EntryID) : ('3' as EntryID),
          finishState: 'FINISHED',
        });
      }),
    };

    const mainMatch = MainMatch.new(args);

    expect(() => mainMatch.setWinnerId('2' as EntryID)).toThrowError(
      new Error('This match is not finished')
    );
  });

  it('勝者はteamId1かteamId2でなければならない', () => {
    const args = {
      id: '1' as MainMatchID,
      courseIndex: 1,
      matchIndex: 1,
      teamId1: '2' as EntryID,
      teamId2: '3' as EntryID,
      runResults: [...Array(4)].map((_, i) => {
        return RunResult.new({
          id: String(i) as RunResultID,
          goalTimeSeconds: i * 10,
          points: 10 + i,
          teamId: i % 2 == 0 ? ('2' as EntryID) : ('3' as EntryID),
          finishState: 'FINISHED',
        });
      }),
    };

    const mainMatch = MainMatch.new(args);

    expect(() => mainMatch.setWinnerId('0' as EntryID)).toThrowError(
      new Error('WinnerId must be teamId1 or teamId2')
    );
    expect(() => mainMatch.setWinnerId('1' as EntryID)).toThrowError(
      new Error('WinnerId must be teamId1 or teamId2')
    );
  });
});
