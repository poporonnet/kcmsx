import { EntryRepository } from '../repository.js';
import { Entry, EntryCreateArgs } from '../entry.js';
import { Option, Result } from '@mikuroxina/mini-fn';

export class EntryService {
  private readonly repository: EntryRepository;
  constructor(repository: EntryRepository) {
    this.repository = repository;
  }
  async create(input: Omit<EntryCreateArgs, 'id'>): Promise<Result.Result<Error, Entry>> {
    const createArgs: EntryCreateArgs = {
      id: crypto.randomUUID(),
      teamName: input.teamName,
      members: input.members,
      isMultiWalk: input.isMultiWalk,
      category: input.category,
    };

    // チーム名は重複できない
    if (await this.isExists(input.teamName)) {
      return Result.err(new Error('teamName Exists'));
    }

    // チームメンバーの制約
    // 共通: 0人のチームは作れない
    if (input.members.length === 0) {
      return Result.err(new Error('no member'));
    }

    if (input.category === 'Open') {
      // オープン部門->1人
      if (input.members.length > 1) {
        return Result.err(new Error('too many members'));
      }
    } else {
      // 小学生部門 -> 1 or 2人
      if (input.members.length > 2) {
        return Result.err(new Error('too many members'));
      }
    }

    const e = Entry.new(createArgs);
    const res = await this.repository.create(e);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    return Result.ok(res[1]);
  }

  private async isExists(teamName: string) {
    const res = await this.repository.findByTeamName(teamName);
    return Option.isSome(res);
  }
}
