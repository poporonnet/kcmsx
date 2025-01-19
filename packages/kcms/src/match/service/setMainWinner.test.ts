import { Option, Result } from '@mikuroxina/mini-fn';
import { config } from 'config';
import { beforeEach, describe, expect, it } from 'vitest';
import { TeamID } from '../../team/models/team';
import { DummyMainMatchRepository } from '../adaptor/dummy/mainMatchRepository';
import { MainMatch, MainMatchID } from '../model/main';
import { RunResult, RunResultID } from '../model/runResult';
import { SetMainMatchWinnerService } from './setMainWinner';

describe('SetMainMatchWinnerService', () => {
  const parentMatch = MainMatch.new({
    id: '103' as MainMatchID,
    courseIndex: 1,
    matchIndex: 2,
    departmentType: config.departmentTypes[0],
    teamID1: undefined,
    teamID2: undefined,
    winnerID: undefined,
    runResults: [],
    parentMatchID: undefined,
    childMatches: undefined,
  });
  const childMatch1 = MainMatch.new({
    id: '101' as MainMatchID,
    courseIndex: 1,
    matchIndex: 2,
    departmentType: config.departmentTypes[0],
    teamID1: '1' as TeamID,
    teamID2: '2' as TeamID,
    winnerID: undefined,
    runResults: [
      RunResult.new({
        id: '80' as RunResultID,
        teamID: '1' as TeamID,
        points: 12,
        goalTimeSeconds: 60,
        finishState: 'GOAL',
      }),
      RunResult.new({
        id: '81' as RunResultID,
        teamID: '2' as TeamID,
        points: 10,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
      RunResult.new({
        id: '82' as RunResultID,
        teamID: '1' as TeamID,
        points: 5,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
      RunResult.new({
        id: '83' as RunResultID,
        teamID: '2' as TeamID,
        points: 7,
        goalTimeSeconds: 80,
        finishState: 'GOAL',
      }),
    ],
    parentMatchID: parentMatch.getID(),
    childMatches: undefined,
  });

  // 未終了のmatch1
  const notFinishedChildMatch1 = MainMatch.new({
    id: '101' as MainMatchID,
    courseIndex: 1,
    matchIndex: 2,
    departmentType: config.departmentTypes[0],
    teamID1: '1' as TeamID,
    teamID2: '2' as TeamID,
    winnerID: undefined,
    runResults: [
      RunResult.new({
        id: '80' as RunResultID,
        teamID: '1' as TeamID,
        points: 12,
        goalTimeSeconds: 60,
        finishState: 'GOAL',
      }),
      RunResult.new({
        id: '81' as RunResultID,
        teamID: '2' as TeamID,
        points: 10,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
    ],
    parentMatchID: parentMatch.getID(),
    childMatches: undefined,
  });
  const childMatch2 = MainMatch.new({
    id: '102' as MainMatchID,
    courseIndex: 1,
    matchIndex: 2,
    departmentType: config.departmentTypes[0],
    teamID1: '10' as TeamID,
    teamID2: '20' as TeamID,
    winnerID: '10' as TeamID,
    runResults: [
      RunResult.new({
        id: '180' as RunResultID,
        teamID: '10' as TeamID,
        points: 12,
        goalTimeSeconds: 60,
        finishState: 'GOAL',
      }),
      RunResult.new({
        id: '181' as RunResultID,
        teamID: '20' as TeamID,
        points: 10,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
      RunResult.new({
        id: '182' as RunResultID,
        teamID: '10' as TeamID,
        points: 5,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
      RunResult.new({
        id: '183' as RunResultID,
        teamID: '20' as TeamID,
        points: 7,
        goalTimeSeconds: 80,
        finishState: 'GOAL',
      }),
    ],
    parentMatchID: parentMatch.getID(),
    childMatches: undefined,
  });
  // 未終了のmatch2
  const notFinishedChildMatch2 = MainMatch.new({
    id: '1020' as MainMatchID,
    courseIndex: 1,
    matchIndex: 2,
    departmentType: config.departmentTypes[0],
    teamID1: '10' as TeamID,
    teamID2: '20' as TeamID,
    winnerID: undefined,
    runResults: [
      RunResult.new({
        id: '180' as RunResultID,
        teamID: '10' as TeamID,
        points: 12,
        goalTimeSeconds: 60,
        finishState: 'GOAL',
      }),
      RunResult.new({
        id: '181' as RunResultID,
        teamID: '20' as TeamID,
        points: 10,
        goalTimeSeconds: Infinity,
        finishState: 'FINISHED',
      }),
    ],
    parentMatchID: parentMatch.getID(),
    childMatches: undefined,
  });
  const mainMatchRepository = new DummyMainMatchRepository([childMatch1, childMatch2, parentMatch]);
  const service = new SetMainMatchWinnerService(mainMatchRepository);

  beforeEach(() => {
    // クリーンアップ
    parentMatch.setChildMatches({ match1: childMatch1, match2: childMatch2 });
    mainMatchRepository.clear([childMatch1, childMatch2, parentMatch]);
  });

  it('試合に勝者を設定できる', async () => {
    const res = await service.handle(childMatch1.getID(), childMatch1.getTeamID1()!);
    expect(res).toEqual(Result.ok(undefined));

    // 試合の勝者が設定されていること
    const matchRes = await mainMatchRepository.findByID(childMatch1.getID());
    expect(Option.isNone(matchRes)).toBe(false);
    const match = Option.unwrap(matchRes);
    expect(match.getWinnerID()).toBe(childMatch1.getTeamID1());

    // もう一方も終了しているなら親チームの情報も同時に更新されていること
    const parentRes = await mainMatchRepository.findByID(parentMatch.getID());
    expect(Option.isNone(parentRes)).toBe(false);
    const parent = Option.unwrap(parentRes);
    expect(parent.getTeamID1()).toBe(childMatch1.getTeamID1());
    expect(parent.getTeamID2()).toBe(childMatch2.getTeamID1());
  });

  it('試合が終了していない時は設定できない', async () => {
    mainMatchRepository.clear([notFinishedChildMatch1, childMatch2, parentMatch]);
    const res = await service.handle(
      notFinishedChildMatch1.getID(),
      notFinishedChildMatch1.getTeamID1()!
    );

    expect(res).toEqual(Result.err(new Error('This match is not finished')));
  });

  it('同じparentを持つ試合の勝者が設定されている場合は、設定と同時にparentのチームも更新される', async () => {
    await service.handle(childMatch1.getID(), childMatch1.getTeamID1()!);

    const parentRes = await mainMatchRepository.findByID(parentMatch.getID());
    expect(Option.isNone(parentRes)).toBe(false);
    const parent = Option.unwrap(parentRes);

    expect(parent.getTeamID1()).toBe(childMatch1.getTeamID1());
    expect(parent.getTeamID2()).toBe(childMatch2.getTeamID1());
  });

  it('同じparentを持つ試合の勝者が設定されていない場合はparentのチームは更新されない', async () => {
    mainMatchRepository.clear([
      childMatch1,
      notFinishedChildMatch2,
      MainMatch.new({
        id: '103' as MainMatchID,
        courseIndex: 1,
        matchIndex: 2,
        departmentType: config.departmentTypes[0],
        teamID1: undefined,
        teamID2: undefined,
        winnerID: undefined,
        runResults: [],
        parentMatchID: undefined,
        childMatches: { match1: childMatch1, match2: notFinishedChildMatch2 },
      }),
    ]);

    await service.handle(childMatch1.getID(), childMatch1.getTeamID1()!);

    const parentRes = await mainMatchRepository.findByID(parentMatch.getID());
    expect(Option.isNone(parentRes)).toBe(false);
    const parent = Option.unwrap(parentRes);

    expect(parent.getTeamID1()).toBe(undefined);
    expect(parent.getTeamID2()).toBe(undefined);
  });
});
