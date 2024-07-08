import { SnowflakeID } from '../../id/main.js';
import { EntryID } from '../../entry/entry.js';

export type RunResultID = SnowflakeID<RunResult>;

/*
 * FinishState
 *   FINISHED: ゴールした
 *   RETIRED: フィニッシュ(リタイア)した
 * */
export type FinishState = 'FINISHED' | 'RETIRED';
export interface CreateRunResultArgs {
  id: RunResultID;
  teamID: EntryID;
  points: number;
  goalTimeSeconds: number;
  finishState: FinishState;
}

export class RunResult {
  private readonly id: RunResultID;
  private readonly teamID: EntryID;
  private readonly points: number;
  private readonly goalTimeSeconds: number;
  private readonly finishState: FinishState;

  private constructor(args: {
    id: RunResultID;
    teamID: EntryID;
    points: number;
    goalTimeSeconds: number;
    finishState: FinishState;
  }) {
    this.id = args.id;
    this.teamID = args.teamID;
    this.points = args.points;
    this.goalTimeSeconds = args.goalTimeSeconds;
    this.finishState = args.finishState;
  }

  public static new(args: CreateRunResultArgs): RunResult {
    if (args.finishState === 'RETIRED') {
      args.goalTimeSeconds = Infinity;
    }
    return new RunResult(args);
  }

  public getId(): RunResultID {
    return this.id;
  }

  public getTeamId(): EntryID {
    return this.teamID;
  }

  public getPoints(): number {
    return this.points;
  }

  public getGoalTimeSeconds(): number {
    return this.goalTimeSeconds;
  }

  /*
   * @return {boolean} ゴールしたかどうか
   * */
  public isFinished(): boolean {
    return this.finishState === 'FINISHED';
  }

  /*
   * @return {boolean} リタイア(フィニッシュ)したかどうか
   */
  public isRetired(): boolean {
    return this.finishState === 'RETIRED';
  }
}
