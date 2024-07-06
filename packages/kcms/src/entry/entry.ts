// Elementary: 小学生部門 / Open: オープン部門
// ToDo: 部門の定義をファイルから読み込むようにする
import { SnowflakeID } from '../id/main.js';

export type EntryCategory = 'Elementary' | 'Open';
export type EntryID = SnowflakeID<'Entry'>;

export interface EntryCreateArgs {
  id: EntryID;
  teamName: string;
  members: Array<string>;
  isMultiWalk: boolean;
  category: EntryCategory;
}

export class Entry {
  private readonly id: EntryID;
  private readonly teamName: string;
  private readonly members: Array<string>;
  private readonly isMultiWalk: boolean;
  private readonly category: EntryCategory;

  private constructor(
    id: EntryID,
    teamName: string,
    _members: Array<string>,
    _isMultiWalk: boolean,
    category: EntryCategory
  ) {
    this.id = id;
    this.teamName = teamName;
    this.members = _members;
    this.isMultiWalk = _isMultiWalk;
    this.category = category;
  }

  getId(): EntryID {
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

  getCategory(): EntryCategory {
    return this.category;
  }

  public static new(arg: EntryCreateArgs): Entry {
    return new Entry(arg.id, arg.teamName, arg.members, arg.isMultiWalk, arg.category);
  }
}
