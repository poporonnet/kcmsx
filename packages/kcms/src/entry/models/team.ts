// Elementary: 小学生部門 / Open: オープン部門
// ToDo: 部門の定義をファイルから読み込むようにする
import { SnowflakeID } from '../../id/main.js';

export type Department = 'Elementary' | 'Open';
export type TeamID = SnowflakeID<'Entry'>;

export interface TeamCreateArgs {
  /** @desc チームID */
  id: TeamID;
  /** @desc チーム名 */
  teamName: string;
  /** @desc メンバー */
  members: Array<string>;
  /**
   * @desc 多脚型か
   *  ToDo: ロボットの種類(RobotType)に変更する
   * */
  isMultiWalk: boolean;
  /** @desc 部門 */
  category: Department;
  /**
   * @desc エントリーしたか
   * @default false
   * */
  isEntered: boolean;
}

export class Team {
  private readonly id: TeamID;
  private readonly teamName: string;
  private readonly members: Array<string>;
  private readonly isMultiWalk: boolean;
  private readonly category: Department;
  private isEntered: boolean;

  private constructor(
    id: TeamID,
    teamName: string,
    _members: Array<string>,
    _isMultiWalk: boolean,
    category: Department,
    isEntered: boolean
  ) {
    this.id = id;
    this.teamName = teamName;
    this.members = _members;
    this.isMultiWalk = _isMultiWalk;
    this.category = category;
    this.isEntered = isEntered;
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

  /**
   * @description エントリーしているかを取得
   * @returns エントリーしているか
   * */
  getIsEntered(): boolean {
    return this.isEntered;
  }

  /**
   * @description エントリーする
   * */
  enter(): void {
    this.isEntered = true;
  }

  public static new(arg: Omit<TeamCreateArgs, 'isEntered'>): Team {
    return new Team(arg.id, arg.teamName, arg.members, arg.isMultiWalk, arg.category, false);
  }

  public static reconstruct(arg: TeamCreateArgs): Team {
    return new Team(
      arg.id,
      arg.teamName,
      arg.members,
      arg.isMultiWalk,
      arg.category,
      arg.isEntered
    );
  }
}
