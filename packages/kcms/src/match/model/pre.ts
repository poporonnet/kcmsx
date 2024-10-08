import { SnowflakeID } from '../../id/main.js';
import { RunResult } from './runResult.js';
import { TeamID } from '../../team/models/team.js';

/** @description 予選試合ID
 * @example "20983209840"
 * */
export type PreMatchID = SnowflakeID<PreMatch>;

export interface CreatePreMatchArgs {
  /** @description 試合ID*/
  id: PreMatchID;
  /** @description コース番号(1始まり) */
  courseIndex: number;
  /** @description 試合番号(1始まり) */
  matchIndex: number;
  /** @description チーム1のID 左を走るチーム */
  teamId1?: TeamID;
  /** @description チーム2のID 右を走るチーム */
  teamId2?: TeamID;
  /** @description 走行結果 */
  runResults: RunResult[];
}

/*
 * @description 予選の試合
 * */
export class PreMatch {
  private readonly id: PreMatchID;
  private readonly courseIndex: number;
  private readonly matchIndex: number;
  private readonly teamId1?: TeamID;
  private readonly teamId2?: TeamID;
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

  getTeamId1(): TeamID | undefined {
    return this.teamId1;
  }

  getTeamId2(): TeamID | undefined {
    return this.teamId2;
  }

  getRunResults(): RunResult[] {
    return this.runResults;
  }

  /**
   * @description 試合に走行結果を追加する 試合結果は1チーム1つづつなので1または2個になる
   * */
  appendRunResults(runResults: RunResult[]): void {
    // 1チーム1つずつ結果を持つので,1 or 2個
    const appendedLength = this.runResults.length + runResults.length;
    if (appendedLength !== 1 && appendedLength !== 2) {
      throw new Error('RunResult length must be 1 or 2');
    }
    if (
      runResults.every(
        (result) => result.getTeamId() !== this.teamId1 && result.getTeamId() !== this.teamId2
      )
    ) {
      throw new Error('RunResult teamId must be teamId1 or teamId2');
    }
    this.runResults.concat(runResults);
  }
}
