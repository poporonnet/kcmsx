import { Result } from '@mikuroxina/mini-fn';
import { config } from 'config';
import { describe, expect, it } from 'vitest';
import { TeamID } from '../../team/models/team.js';
import { CreateMainMatchArgs, MainMatch, MainMatchID } from './main.js';
import { RunResult, RunResultID } from './runResult.js';

describe('MainMatch', () => {
  it('正しく初期化できる', () => {
    const args: CreateMainMatchArgs = {
      id: '1' as MainMatchID,
      courseIndex: 1,
      matchIndex: 1,
      departmentType: config.departmentTypes[0],
      teamID1: '2' as TeamID,
      teamID2: '3' as TeamID,
      winnerID: '2' as TeamID,
      runResults: [],
      parentMatchID: '10' as MainMatchID,
      childMatches: undefined,
    };

    const res = MainMatch.new(args);
    expect(res.getID()).toBe(args.id);
    expect(res.getCourseIndex()).toBe(args.courseIndex);
    expect(res.getMatchIndex()).toBe(args.matchIndex);
    expect(res.getTeamID1()).toBe(args.teamID1);
    expect(res.getTeamID2()).toBe(args.teamID2);
    expect(res.getWinnerID()).toBe(args.winnerID);
    expect(res.getRunResults()).toBe(args.runResults);
  });

  it('走行結果は0 or 2 or 4になる', () => {
    for (let j = 1; j < 100; j++) {
      const mainMatch = MainMatch.new({
        id: '1' as MainMatchID,
        courseIndex: 1,
        matchIndex: 1,
        departmentType: config.departmentTypes[0],
        teamID1: '2' as TeamID,
        teamID2: '3' as TeamID,
        winnerID: '2' as TeamID,
        runResults: [],
        parentMatchID: '10' as MainMatchID,
        childMatches: undefined,
      });
      const appendRes = Result.wrapThrowable((error) => error)(() => {
        mainMatch.appendRunResults(
          [...Array(j)].map((_, i) => {
            return RunResult.new({
              id: String(i) as RunResultID,
              goalTimeSeconds: i * 10,
              points: 10 + i,
              teamID: i % 2 == 0 ? ('2' as TeamID) : ('3' as TeamID),
              finishState: 'FINISHED',
            });
          })
        );
      })();
      // 2か4以外は足せない
      const isExpectedOk = j == 1 || j == 2 || j == 4;
      expect(Result.isOk(appendRes)).toBe(isExpectedOk);
      expect(mainMatch.getRunResults().length).toBe(isExpectedOk ? j : 0);
    }
  });

  it('走行結果を追加できる', () => {
    for (let i = 1; i <= 2; i++) {
      const mainMatch = MainMatch.new({
        id: '1' as MainMatchID,
        courseIndex: 1,
        matchIndex: 1,
        departmentType: config.departmentTypes[0],
        teamID1: '2' as TeamID,
        teamID2: '3' as TeamID,
        winnerID: '2' as TeamID,
        runResults: [],
        parentMatchID: '10' as MainMatchID,
        childMatches: undefined,
      });
      for (let j = 1; j < 8; j++) {
        const appendRes = Result.wrapThrowable((error) => error)(() => {
          mainMatch.appendRunResults(
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
        })();
        const isExpectedOk = j === 1 || j === 2;
        expect(Result.isOk(appendRes)).toBe(isExpectedOk);
      }
    }
  });

  it('勝者を指定できる', () => {
    const args: CreateMainMatchArgs = {
      id: '1' as MainMatchID,
      courseIndex: 1,
      matchIndex: 1,
      departmentType: config.departmentTypes[0],
      teamID1: '2' as TeamID,
      teamID2: '3' as TeamID,
      runResults: [...Array(4)].map((_, i) =>
        RunResult.new({
          id: String(i) as RunResultID,
          goalTimeSeconds: i * 10,
          points: 10 + i,
          teamID: i % 2 == 0 ? ('2' as TeamID) : ('3' as TeamID),
          finishState: 'FINISHED',
        })
      ),
      parentMatchID: '10' as MainMatchID,
      childMatches: undefined,
    };

    const mainMatch = MainMatch.new(args);

    expect(() => mainMatch.setWinnerID('2' as TeamID)).not.toThrow(
      new Error('WinnerID is already set')
    );
  });

  it('勝者が決まっているときは変更できない', () => {
    const args: CreateMainMatchArgs = {
      id: '1' as MainMatchID,
      courseIndex: 1,
      matchIndex: 1,
      departmentType: config.departmentTypes[0],
      teamID1: '2' as TeamID,
      teamID2: '3' as TeamID,
      winnerID: '2' as TeamID,
      runResults: [...Array(4)].map((_, i) => {
        return RunResult.new({
          id: String(i) as RunResultID,
          goalTimeSeconds: i * 10,
          points: 10 + i,
          teamID: i % 2 == 0 ? ('2' as TeamID) : ('3' as TeamID),
          finishState: 'FINISHED',
        });
      }),
      parentMatchID: '10' as MainMatchID,
      childMatches: undefined,
    };

    const mainMatch = MainMatch.new(args);

    expect(() => mainMatch.setWinnerID('2' as TeamID)).toThrowError(
      new Error('WinnerID is already set')
    );
  });

  it('試合が終わっていないときは設定できない', () => {
    const args: CreateMainMatchArgs = {
      id: '1' as MainMatchID,
      courseIndex: 1,
      matchIndex: 1,
      departmentType: config.departmentTypes[0],
      teamID1: '2' as TeamID,
      teamID2: '3' as TeamID,
      runResults: [...Array(2)].map((_, i) => {
        return RunResult.new({
          id: String(i) as RunResultID,
          goalTimeSeconds: i * 10,
          points: 10 + i,
          teamID: i % 2 == 0 ? ('2' as TeamID) : ('3' as TeamID),
          finishState: 'FINISHED',
        });
      }),
      parentMatchID: '10' as MainMatchID,
      childMatches: undefined,
    };

    const mainMatch = MainMatch.new(args);

    expect(() => mainMatch.setWinnerID('2' as TeamID)).toThrowError(
      new Error('This match is not finished')
    );
  });

  it('勝者はteamID1かteamID2でなければならない', () => {
    const args: CreateMainMatchArgs = {
      id: '1' as MainMatchID,
      courseIndex: 1,
      matchIndex: 1,
      departmentType: config.departmentTypes[0],
      teamID1: '2' as TeamID,
      teamID2: '3' as TeamID,
      runResults: [...Array(4)].map((_, i) => {
        return RunResult.new({
          id: String(i) as RunResultID,
          goalTimeSeconds: i * 10,
          points: 10 + i,
          teamID: i % 2 == 0 ? ('2' as TeamID) : ('3' as TeamID),
          finishState: 'FINISHED',
        });
      }),
      parentMatchID: '10' as MainMatchID,
      childMatches: undefined,
    };

    const mainMatch = MainMatch.new(args);

    expect(() => mainMatch.setWinnerID('0' as TeamID)).toThrowError(
      new Error('WinnerID must be teamID1 or teamID2')
    );
    expect(() => mainMatch.setWinnerID('1' as TeamID)).toThrowError(
      new Error('WinnerID must be teamID1 or teamID2')
    );
  });

  it('チームは上書き設定できない', () => {
    const args: CreateMainMatchArgs = {
      id: '1' as MainMatchID,
      courseIndex: 1,
      matchIndex: 1,
      departmentType: config.departmentTypes[0],
      teamID1: '2' as TeamID,
      teamID2: '3' as TeamID,
      runResults: [...Array(4)].map((_, i) => {
        return RunResult.new({
          id: String(i) as RunResultID,
          goalTimeSeconds: i * 10,
          points: 10 + i,
          teamID: i % 2 == 0 ? ('2' as TeamID) : ('3' as TeamID),
          finishState: 'FINISHED',
        });
      }),
      parentMatchID: '10' as MainMatchID,
      childMatches: undefined,
    };
    const mainMatch = MainMatch.new(args);

    expect(() => mainMatch.setTeams('4' as TeamID, '5' as TeamID)).toThrowError(
      new Error('Teams are already set')
    );
  });

  it('チームを設定できる', () => {
    const args: CreateMainMatchArgs = {
      id: '1' as MainMatchID,
      courseIndex: 1,
      matchIndex: 1,
      departmentType: config.departmentTypes[0],
      teamID1: undefined,
      teamID2: undefined,
      runResults: [],
      parentMatchID: '10' as MainMatchID,
      childMatches: undefined,
    };
    const mainMatch = MainMatch.new(args);

    expect(() => mainMatch.setTeams('4' as TeamID, '5' as TeamID)).not.toThrowError(
      new Error('Teams are already set')
    );
    expect(mainMatch.getTeamID1()).toStrictEqual('4' as TeamID);
    expect(mainMatch.getTeamID2()).toStrictEqual('5' as TeamID);
  });
});
