import { EntryRepository } from '../repository.js';
import { Entry, EntryID } from '../entry.js';
import { Option, Result } from '@mikuroxina/mini-fn';

export class FindEntryService {
  private readonly repository: EntryRepository;

  constructor(repository: EntryRepository) {
    this.repository = repository;
  }

  async findAll(): Promise<Result.Result<Error, Array<EntryDTO>>> {
    const res = await this.repository.findAll();
    if (Result.isErr(res)) {
      return res;
    }

    const result = res[1].map((entry) => EntryDTO.fromDomain(entry));

    return Result.ok(result);
  }

  async findByID(id: string): Promise<Result.Result<Error, EntryDTO>> {
    const res = await this.repository.findByID(id);
    if (Option.isNone(res)) {
      return Result.err(new Error('Not found'));
    }

    return Result.ok(EntryDTO.fromDomain(res[1]));
  }

  async findByTeamName(name: string): Promise<Result.Result<Error, EntryDTO>> {
    const res = await this.repository.findByTeamName(name);
    if (Option.isNone(res)) {
      return Result.err(new Error('Not found'));
    }

    return Result.ok(EntryDTO.fromDomain(res[1]));
  }
}

export class EntryDTO {
  private readonly _id: string;
  private readonly _teamName: string;
  private readonly _members: string[];
  private readonly _isMultiWalk: boolean;
  private readonly _category: 'Elementary' | 'Open';

  private constructor(
    id: string,
    teamName: string,
    members: string[],
    isMultiWalk: boolean,
    category: 'Elementary' | 'Open'
  ) {
    this._id = id;
    this._teamName = teamName;
    this._members = members;
    this._isMultiWalk = isMultiWalk;
    this._category = category;
  }

  public static fromDomain(d: Entry): EntryDTO {
    return new EntryDTO(d.id, d.teamName, d.members, d.isMultiWalk, d.category);
  }

  public toToDomain(): Entry {
    return Entry.new({
      id: this._id as EntryID,
      teamName: this._teamName,
      members: this._members,
      isMultiWalk: this._isMultiWalk,
      category: this._category,
    });
  }

  get id(): string {
    return this._id;
  }

  get teamName(): string {
    return this._teamName;
  }

  get members(): string[] {
    return this._members;
  }

  get isMultiWalk(): boolean {
    return this._isMultiWalk;
  }

  get category(): string {
    return this._category;
  }
}
