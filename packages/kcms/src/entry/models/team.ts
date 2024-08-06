// Elementary: 小学生部門 / Open: オープン部門
// ToDo: 部門の定義をファイルから読み込むようにする
import { SnowflakeID } from '../../id/main.js';

export type Department = 'Elementary' | 'Open';
export type TeamID = SnowflakeID<'Entry'>;

export interface TeamCreateArgs {
  id: TeamID;
  teamName: string;
  members: Array<string>;
  isMultiWalk: boolean;
  category: Department;
}

export class Team {
  private readonly id: TeamID;
  private readonly teamName: string;
  private readonly members: Array<string>;
  private readonly isMultiWalk: boolean;
  private readonly category: Department;

  private constructor(
    id: TeamID,
    teamName: string,
    _members: Array<string>,
    _isMultiWalk: boolean,
    category: Department
  ) {
    this.id = id;
    this.teamName = teamName;
    this.members = _members;
    this.isMultiWalk = _isMultiWalk;
    this.category = category;
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

  public static new(arg: TeamCreateArgs): Team {
    return new Team(arg.id, arg.teamName, arg.members, arg.isMultiWalk, arg.category);
  }
}
