import { EntryRepository } from "./repository.js";
import { EntryService } from "./service/entry.js";
import { Entry } from "./entry.js";
import { Result } from "@mikuroxina/mini-fn";
import { FindEntryService } from "./service/get.js";

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

  constructor(repository: EntryRepository) {
    this.entry = new EntryService(repository);
    this.find = new FindEntryService(repository);
  }

  async create(args: {
    teamName: string;
    members: string[];
    isMultiWalk: boolean;
    category: "Elementary" | "Open";
  }): Promise<Result.Result<Error, baseEntry>> {
    const entry = Entry.new({
      id: "",
      ...args,
    });

    const res = await this.entry.create(entry);
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
      }),
    );
  }
}
