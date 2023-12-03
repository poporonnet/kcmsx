import { EntryRepository } from "../repository.js";
import { Entry } from "../entry.js";
import { Option, Result } from "@mikuroxina/mini-fn";

export class EntryService {
  private readonly repository: EntryRepository;
  constructor(repository: EntryRepository) {
    this.repository = repository;
  }
  async create(entry: Entry) {
    // チーム名は重複できない
    if (await this.isExists(entry.teamName)) {
      return Result.err(new Error("teamName Exists"));
    }

    // チームメンバーの制約
    // 共通: 0人のチームは作れない
    if (entry.members.length === 0) {
      return Result.err(new Error("no member"));
    }

    if (entry.category === "Open") {
      // オープン部門->1人
      if (entry.members.length > 1) {
        return Result.err(new Error("too many members"));
      }
    } else {
      // 小学生部門 -> 1 or 2人
      if (entry.members.length > 2) {
        return Result.err(new Error("too many members"));
      }
    }
    return await this.repository.create(entry);
  }

  private async isExists(teamName: string) {
    const res = await this.repository.findByTeamName(teamName);
    return Option.isSome(res);
  }
}
