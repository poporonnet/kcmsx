import { Result } from '@mikuroxina/mini-fn';
import { DepartmentType } from 'config';
import { SnowflakeID } from '../../id/main.js';
import { TeamID } from '../../team/models/team.js';
import { RunResult } from './runResult.js';

export type MainMatchID = SnowflakeID<MainMatch>;
export interface CreateMainMatchArgs {
  id: MainMatchID;
  courseIndex: number;
  matchIndex: number;
  departmentType: DepartmentType;
  teamId1?: TeamID;
  teamId2?: TeamID;
  winnerId?: TeamID;
  runResults: RunResult[];
  parentMatchID: MainMatchID | undefined;
  childMatches: ChildMatches | undefined;
}

/**
 * トーナメントで自分より前に行われた2試合
 */
export interface ChildMatches {
  match1: MainMatch;
  match2: MainMatch;
}

/*
 * @description 本戦の試合
 * parentIDとchildMatchesが同時にundefinedになることはない
 */
export class MainMatch {
  private readonly id: MainMatchID;
  private readonly courseIndex: number;
  private readonly matchIndex: number;
  private readonly departmentType: DepartmentType;
  private readonly teamId1?: TeamID;
  private readonly teamId2?: TeamID;

  /**
   * トーナメントで自分より後に行われる1試合のID\
   * 決勝の場合はparentIDはundefinedになる
   */
  private parentID?: MainMatchID;
  /**
   * トーナメントで自分より前に行われた2試合\
   * 1回戦目はundefinedになる
   */
  private childMatches?: ChildMatches;

  private winnerId?: TeamID;
  private runResults: RunResult[];

  private constructor(args: CreateMainMatchArgs) {
    this.id = args.id;
    this.courseIndex = args.courseIndex;
    this.matchIndex = args.matchIndex;
    this.departmentType = args.departmentType;
    this.teamId1 = args.teamId1;
    this.teamId2 = args.teamId2;
    this.winnerId = args.winnerId;
    this.runResults = args.runResults;
    this.parentID = args.parentMatchID;
    this.childMatches = args.childMatches;
  }

  /**
   * @description MainMatchを生成する
   * @param args
   * @throws {Error} parentID と childMatches が同時にundefinedの時はErrorをthrowする
   */
  public static new(args: CreateMainMatchArgs) {
    // Note: 本戦トーナメント生成時にはparentID/childMatchesはどちらもundefinedになる
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

  getDepartmentType(): DepartmentType {
    return this.departmentType;
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
    if (appendedLength !== 4 && appendedLength !== 2 && appendedLength !== 1) {
      throw new Error('RunResult length must be 2 or 4');
    }
    this.runResults.push(...results);
  }

  getParentID(): MainMatchID | undefined {
    return this.parentID;
  }

  setParentID(parentID: MainMatchID): Result.Result<Error, void> {
    if (this.parentID) {
      return Result.err(new Error('ParentIDはすでにセットされています'));
    }
    this.parentID = parentID;
    return Result.ok(undefined);
  }

  getChildMatches(): ChildMatches | undefined {
    return this.childMatches;
  }

  setChildMatches(childMatches: ChildMatches): Result.Result<Error, void> {
    if (this.childMatches) {
      return Result.err(new Error('childMatchesはすでにセットされています'));
    }
    this.childMatches = childMatches;
    return Result.ok(undefined);
  }
}
