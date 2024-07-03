import { EntryRepository } from './repository.js';
import { EntryService } from './service/entry.js';
import { Result, Option } from '@mikuroxina/mini-fn';
import { FindEntryService } from './service/get.js';
import { DeleteEntryService } from './service/delete.js';
import { SnowflakeIDGenerator } from '../id/main.js';

interface baseEntry {
  id: string;
  teamName: string;
  members: string[];
  isMultiWalk: boolean;
  category: string;
}

export class Controller {
  private readonly entry: EntryService;
  private readonly find: FindEntryService;
  private readonly deleteService: DeleteEntryService;

  constructor(repository: EntryRepository) {
    this.entry = new EntryService(
      repository,
      new SnowflakeIDGenerator(1, () => BigInt(new Date().getTime()))
    );
    this.find = new FindEntryService(repository);
    this.deleteService = new DeleteEntryService(repository);
  }

  async create(args: {
    teamName: string;
    members: string[];
    isMultiWalk: boolean;
    category: 'Elementary' | 'Open';
  }): Promise<Result.Result<Error, baseEntry>> {
    const res = await this.entry.create(args);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    return Result.ok(res[1]);
  }

  async get(): Promise<Result.Result<Error, baseEntry[]>> {
    const res = await this.find.findAll();
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    return Result.ok(
      res[1].map((v) => {
        return {
          id: v.id,
          teamName: v.teamName,
          members: v.members,
          isMultiWalk: v.isMultiWalk,
          category: v.category,
        };
      })
    );
  }

  async delete(id: string): Promise<Option.Option<Error>> {
    const res = await this.deleteService.handle(id);
    if (Option.isSome(res)) {
      return Option.some(res[1]);
    }

    return Option.none();
  }
}
