import { SnowflakeID } from '../../id/main.js';
import { EntryID } from '../../entry/entry.js';

export type RunResultID = SnowflakeID<RunResult>;

export interface CreateRunResultArgs {
  id: RunResultID;
  teamID: EntryID;
  points: number;
  goalTime: number;
  isFinished: boolean;
}

export class RunResult {
  private readonly id: RunResultID;
  private readonly teamID: EntryID;
  private readonly points: number;
  private readonly goalTime: number;
  private readonly isFinished: boolean;

  private constructor(args: {
    id: RunResultID;
    teamID: EntryID;
    points: number;
    goalTime: number;
    isFinished: boolean;
  }) {
    this.id = args.id;
    this.teamID = args.teamID;
    this.points = args.points;
    this.goalTime = args.goalTime;
    this.isFinished = args.isFinished;
  }

  public static new(args: CreateRunResultArgs): RunResult {
    return new RunResult(args);
  }

  public getId(): RunResultID {
    return this.id;
  }

  public getTeamID(): EntryID {
    return this.teamID;
  }

  public getPoints(): number {
    return this.points;
  }

  public getGoalTime(): number {
    return this.goalTime;
  }

  public getIsFinished(): boolean {
    return this.isFinished;
  }
}
