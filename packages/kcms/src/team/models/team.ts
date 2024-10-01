// Elementary: 小学生部門 / Open: オープン部門
// ToDo: 部門の定義をファイルから読み込むようにする
import { SnowflakeID } from '../../id/main.js';
import { DepartmentType } from 'config';

/**
 * @deprecated この型は廃止予定. {@link DepartmentType}を使うこと
 */
export type Department = 'Elementary' | 'Open';
export type TeamID = SnowflakeID<Team>;

export interface TeamCreateArgs {
  id: TeamID;
  teamName: string;
  members: Array<string>;
  /**
   * @deprecated ToDo: Configで設定されている値を使う
   */
  isMultiWalk: boolean;
  /**
   * @deprecated ToDo: Configで設定されている値を使う
   */
  category: Department;
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
  private readonly members: Array<string>;
  private readonly isMultiWalk: boolean;
  private readonly category: Department;
  private readonly departmentType: DepartmentType;
  private readonly clubName?: string;
  private isEntered: boolean;

  private constructor(
    id: TeamID,
    teamName: string,
    _members: Array<string>,
    _isMultiWalk: boolean,
    category: Department,
    departmentType: DepartmentType,
    isEntered: boolean,
    clubName?: string
  ) {
    this.id = id;
    this.teamName = teamName;
    this.members = _members;
    this.isMultiWalk = _isMultiWalk;
    this.category = category;
    this.clubName = clubName;
    this.isEntered = isEntered;
    this.departmentType = departmentType;
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

  /**
   * @deprecated Configで設定されている値を使う
   */
  getIsMultiWalk(): boolean {
    return this.isMultiWalk;
  }

  getCategory(): Department {
    return this.category;
  }

  getDepartmentType(): DepartmentType {
    return this.departmentType;
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
      arg.isMultiWalk,
      arg.category,
      arg.departmentType,
      false,
      arg.clubName
    );
  }

  public static reconstruct(arg: TeamCreateArgs): Team {
    return new Team(
      arg.id,
      arg.teamName,
      arg.members,
      arg.isMultiWalk,
      arg.category,
      arg.departmentType,
      arg.isEntered,
      arg.clubName
    );
  }
}
