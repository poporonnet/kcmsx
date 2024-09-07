// Elementary: 小学生部門 / Open: オープン部門
// ToDo: 部門の定義をファイルから読み込むようにする
import { SnowflakeID } from '../../id/main.js';

export type Department = 'Elementary' | 'Open';
export type TeamID = SnowflakeID<Team>;

export interface TeamCreateArgs {
  id: TeamID;
  teamName: string;
  members: Array<string>;
  isMultiWalk: boolean;
  category: Department;
  clubName?: string;
}

export class Team {
  private readonly id: TeamID;
  private readonly teamName: string;
  private readonly members: Array<string>;
  private readonly isMultiWalk: boolean;
  private readonly category: Department;
  private readonly clubName?: string;

  private constructor(
    id: TeamID,
    teamName: string,
    _members: Array<string>,
    _isMultiWalk: boolean,
    category: Department,
    clubName?: string
  ) {
    this.id = id;
    this.teamName = teamName;
    this.members = _members;
    this.isMultiWalk = _isMultiWalk;
    this.category = category;
    this.clubName = clubName;
  }

  getId(): TeamID {
    return this.id;
  }

  getTeamName(): string {
    return this.teamName;
  }

  getMembers(): Array<string> {
    return this.members;
  }

  getIsMultiWalk(): boolean {
    return this.isMultiWalk;
  }

  getCategory(): Department {
    return this.category;
  }

  getClubName(): string | undefined {
    return this.clubName;
  }

  public static new(arg: TeamCreateArgs): Team {
    return new Team(arg.id, arg.teamName, arg.members, arg.isMultiWalk, arg.category, arg.clubName);
  }
}
