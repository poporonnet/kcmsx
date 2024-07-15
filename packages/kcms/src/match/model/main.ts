import { SnowflakeID } from '../../id/main.js';
import { RunResult } from './runResult.js';
import { EntryID } from '../../entry/entry.js';

export type MainMatchID = SnowflakeID<MainMatch>;
export interface CreateMainMatchArgs {
  id: MainMatchID;
  courseIndex: number;
  matchIndex: number;
  teamId1?: EntryID;
  teamId2?: EntryID;
  winnerId?: EntryID;
  runResults: RunResult[];
}

/*
 * @description 本戦の試合
 */
export class MainMatch {
  private readonly id: MainMatchID;
  private readonly courseIndex: number;
  private readonly matchIndex: number;
  private readonly teamId1?: EntryID;
  private readonly teamId2?: EntryID;
  private winnerId?: EntryID;
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

  getTeamId1(): string | undefined {
    return this.teamId1;
  }

  getTeamId2(): string | undefined {
    return this.teamId2;
  }

  getWinnerId(): string | undefined {
    return this.winnerId;
  }

  setWinnerId(winnerId: EntryID) {
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
    if (
      appendedLength !== 4 &&
      appendedLength !== 2
    ) {
      throw new Error('RunResult length must be 2 or 4');
    }
    this.runResults.concat(results);
  }
}
