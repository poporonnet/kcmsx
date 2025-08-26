import { SnowflakeID } from '../../id/main.js';
import { TeamID } from '../../team/models/team.js';

export type RunResultID = SnowflakeID<RunResult>;

/*
 * FinishState
 *   GOAL: ゴールした
 *   FINISHED: フィニッシュ(リタイア)した
 * */
export type FinishState = 'GOAL' | 'FINISHED';
export interface CreateRunResultArgs {
  id: RunResultID;
  teamID: TeamID;
  points: number;
  goalTimeSeconds: number;
  finishState: FinishState;
}

export class RunResult {
  private readonly id: RunResultID;
  private readonly teamID: TeamID;
  private readonly points: number;
  private readonly goalTimeSeconds: number;
  private readonly finishState: FinishState;

  private constructor(args: {
    id: RunResultID;
    teamID: TeamID;
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
    if (args.finishState === 'FINISHED') {
      args.goalTimeSeconds = Infinity;
    }
    return new RunResult(args);
  }

  public getID(): RunResultID {
    return this.id;
  }

  public getTeamID(): TeamID {
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
  public isGoal(): boolean {
    return this.finishState === 'GOAL';
  }

  /*
   * @return {boolean} フィニッシュ(リタイア)したかどうか
   */
  public isFinished(): boolean {
    return this.finishState === 'FINISHED';
  }

  public static reconstruct(args: CreateRunResultArgs): RunResult {
    return new RunResult({
      id: args.id,
      teamID: args.teamID,
      points: args.points,
      goalTimeSeconds: args.goalTimeSeconds,
      finishState: args.finishState,
    });
  }
}
