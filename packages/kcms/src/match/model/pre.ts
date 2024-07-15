import { SnowflakeID } from '../../id/main.js';
import { RunResult } from './runResult.js';
import { EntryID } from '../../entry/entry.js';

export type PreMatchID = SnowflakeID<PreMatch>;

export interface CreatePreMatchArgs {
  id: PreMatchID;
  courseIndex: number;
  matchIndex: number;
  teamId1: EntryID;
  teamId2?: EntryID;
  runResults: RunResult[];
}

/*
 * @description 予選の試合
 * */
export class PreMatch {
  private readonly id: PreMatchID;
  private readonly courseIndex: number;
  private readonly matchIndex: number;
  private readonly teamId1: EntryID;
  // NOTE: 予選参加者は奇数になる可能性があるので2チーム目はいないことがある
  private readonly teamId2?: EntryID;
  private runResults: RunResult[];

  private constructor(args: CreatePreMatchArgs) {
    this.id = args.id;
    this.courseIndex = args.courseIndex;
    this.matchIndex = args.matchIndex;
    this.teamId1 = args.teamId1;
    this.teamId2 = args.teamId2;
    this.runResults = args.runResults;
  }

  public static new(args: CreatePreMatchArgs) {
    return new PreMatch(args);
  }

  getId(): PreMatchID {
    return this.id;
  }

  getCourseIndex(): number {
    return this.courseIndex;
  }

  getMatchIndex(): number {
    return this.matchIndex;
  }

  getTeamId1(): EntryID {
    return this.teamId1;
  }

  getTeamId2(): EntryID | undefined {
    return this.teamId2;
  }

  getRunResults(): RunResult[] {
    return this.runResults;
  }

  appendRunResults(runResults: RunResult[]) {
    // 1チーム1つずつ結果を持つので,1 or 2個
    const appendedLength = this.runResults.length + runResults.length;
    if (appendedLength !== 1 && appendedLength !== 2) {
      throw new Error('RunResult length must be 1 or 2');
    }
    if (
      runResults.some((result) => result.getTeamId() !== this.teamId1) ||
      (this.teamId2 && runResults.some((result) => result.getTeamId() !== this.teamId2))
    ) {
      throw new Error('RunResult teamId must be teamId1 or teamId2');
    }
    this.runResults.concat(runResults);
  }
}
