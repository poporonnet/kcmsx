import { DepartmentType, RobotType } from 'config';
import { SnowflakeID } from '../../id/main.js';

export type TeamID = SnowflakeID<Team>;

export interface TeamCreateArgs {
  id: TeamID;
  teamName: string;
  members: string[];
  robotType: RobotType;
  departmentType: DepartmentType;
  clubName?: string;
  /**
   * 当日参加するかどうか (エントリーしたかどうか)
   */
  isEntered: boolean;
}

export class Team {
  private readonly id: TeamID;
  private readonly teamName: string;
  private readonly members: string[];
  private readonly departmentType: DepartmentType;
  private readonly robotType: RobotType;
  private readonly clubName?: string;
  private isEntered: boolean;

  private constructor(
    id: TeamID,
    teamName: string,
    members: string[],
    departmentType: DepartmentType,
    robotType: RobotType,
    isEntered: boolean,
    clubName?: string
  ) {
    this.id = id;
    this.teamName = teamName;
    this.members = members;
    this.clubName = clubName;
    this.isEntered = isEntered;
    this.departmentType = departmentType;
    this.robotType = robotType;
  }

  getID(): TeamID {
    return this.id;
  }

  getTeamName(): string {
    return this.teamName;
  }

  getMembers(): string[] {
    return this.members;
  }

  getDepartmentType(): DepartmentType {
    return this.departmentType;
  }

  getRobotType(): RobotType {
    return this.robotType;
  }

  getClubName(): string | undefined {
    return this.clubName;
  }

  /**
   * エントリー(当日参加するか)したかどうかを取得
   */
  getIsEntered(): boolean {
    return this.isEntered;
  }

  /**
   * エントリーする
   * */
  enter() {
    this.isEntered = true;
  }

  /**
   * エントリーを取り消す
   * */
  cancelEntry() {
    this.isEntered = false;
  }

  public static new(arg: Omit<TeamCreateArgs, 'isEntered'>): Team {
    return new Team(
      arg.id,
      arg.teamName,
      arg.members,
      arg.departmentType,
      arg.robotType,
      false,
      arg.clubName
    );
  }

  public static reconstruct(arg: TeamCreateArgs): Team {
    return new Team(
      arg.id,
      arg.teamName,
      arg.members,
      arg.departmentType,
      arg.robotType,
      arg.isEntered,
      arg.clubName
    );
  }
}
