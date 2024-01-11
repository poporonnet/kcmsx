// Elementary: 小学生部門 / Open: オープン部門
// ToDo: 部門の定義をファイルから読み込むようにする
export type EntryCategory = 'Elementary' | 'Open';
export interface EntryCreateArgs {
  id: string;
  teamName: string;
  members: Array<string>;
  isMultiWalk: boolean;
  category: EntryCategory;
}

export class Entry {
  private readonly _id: string;
  private readonly _teamName: string;
  private readonly _members: Array<string>;
  private readonly _isMultiWalk: boolean;
  private readonly _category: EntryCategory;

  private constructor(
    id: string,
    teamName: string,
    _members: Array<string>,
    _isMultiWalk: boolean,
    category: EntryCategory
  ) {
    this._id = id;
    this._teamName = teamName;
    this._members = _members;
    this._isMultiWalk = _isMultiWalk;
    this._category = category;
  }

  get id(): string {
    return this._id;
  }

  get teamName(): string {
    return this._teamName;
  }

  get members(): Array<string> {
    return this._members;
  }

  get isMultiWalk(): boolean {
    return this._isMultiWalk;
  }

  get category(): EntryCategory {
    return this._category;
  }

  public static new(arg: EntryCreateArgs): Entry {
    return new Entry(arg.id, arg.teamName, arg.members, arg.isMultiWalk, arg.category);
  }
}
