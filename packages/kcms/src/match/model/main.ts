import { SnowflakeID } from '../../id/main.js';
import { TeamID } from '../../team/models/team.js';
import { RunResult } from './runResult.js';

export type MainMatchID = SnowflakeID<MainMatch>;
export interface CreateMainMatchArgs {
  id: MainMatchID;
  courseIndex: number;
  matchIndex: number;
  teamId1?: TeamID;
  teamId2?: TeamID;
  winnerId?: TeamID;
  runResults: RunResult[];
}

/*
 * @description 本戦の試合
 */
export class MainMatch {
  private readonly id: MainMatchID;
  private readonly courseIndex: number;
  private readonly matchIndex: number;
  private readonly teamId1?: TeamID;
  private readonly teamId2?: TeamID;
  private winnerId?: TeamID;
  private runResults: RunResult[];

  private constructor(args: CreateMainMatchArgs) {
    this.id = args.id;
    this.courseIndex = args.courseIndex;
    this.matchIndex = args.matchIndex;
    this.teamId1 = args.teamId1;
    this.teamId2 = args.teamId2;
    this.winnerId = args.winnerId;
    this.runResults = args.runResults;
  }

  public static new(args: CreateMainMatchArgs) {
    return new MainMatch(args);
  }

  getId(): MainMatchID {
    return this.id;
  }

  getCourseIndex(): number {
    return this.courseIndex;
  }

  getMatchIndex(): number {
    return this.matchIndex;
  }

  getTeamId1(): TeamID | undefined {
    return this.teamId1;
  }

  getTeamId2(): TeamID | undefined {
    return this.teamId2;
  }

  getWinnerId(): TeamID | undefined {
    return this.winnerId;
  }

  setWinnerId(winnerId: TeamID) {
    if (this.winnerId !== undefined) {
      throw new Error('WinnerId is already set');
    }
    if (this.teamId1 !== winnerId && this.teamId2 !== winnerId) {
      throw new Error('WinnerId must be teamId1 or teamId2');
    }
    if (this.runResults.length !== 4) {
      throw new Error('This match is not finished');
    }
    this.winnerId = winnerId;
  }

  getRunResults(): RunResult[] {
    return this.runResults;
  }

  appendRunResults(results: RunResult[]) {
    // 1チームが2つずつ結果を持つので、2 または 4個
    const appendedLength = this.runResults.length + results.length;
    if (appendedLength !== 4 && appendedLength !== 2) {
      throw new Error('RunResult length must be 2 or 4');
    }
    this.runResults.concat(results);
  }
}
