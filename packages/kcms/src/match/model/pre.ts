import { DepartmentType } from 'config';
import { SnowflakeID } from '../../id/main.js';
import { TeamID } from '../../team/models/team.js';
import { RunResult } from './runResult.js';

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
  /** @description 部門 */
  departmentType: DepartmentType;
  /** @description チーム1のID 左を走るチーム */
  teamID1?: TeamID;
  /** @description チーム2のID 右を走るチーム */
  teamID2?: TeamID;
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
  private readonly departmentType: DepartmentType;
  private readonly teamID1?: TeamID;
  private readonly teamID2?: TeamID;
  private runResults: RunResult[];

  private constructor(args: CreatePreMatchArgs) {
    this.id = args.id;
    this.courseIndex = args.courseIndex;
    this.matchIndex = args.matchIndex;
    this.teamID1 = args.teamID1;
    this.teamID2 = args.teamID2;
    this.runResults = args.runResults;
    this.departmentType = args.departmentType;
  }

  public static new(args: CreatePreMatchArgs) {
    return new PreMatch(args);
  }

  public static reconstruct(args: CreatePreMatchArgs) {
    return new PreMatch(args);
  }

  getID(): PreMatchID {
    return this.id;
  }

  getCourseIndex(): number {
    return this.courseIndex;
  }

  getMatchIndex(): number {
    return this.matchIndex;
  }

  getTeamID1(): TeamID | undefined {
    return this.teamID1;
  }

  getTeamID2(): TeamID | undefined {
    return this.teamID2;
  }

  getRunResults(): RunResult[] {
    return this.runResults;
  }

  getDepartmentType(): DepartmentType {
    return this.departmentType;
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
      !runResults.every(
        (result) => result.getTeamID() === this.teamID1 || result.getTeamID() === this.teamID2
      )
    ) {
      throw new Error('RunResult teamID must be teamID1 or teamID2');
    }
    this.runResults.push(...runResults);
  }
}
