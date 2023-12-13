import { Match } from "../match.js";
import { MatchRepository } from "../service/repository.js";
import { Result } from "@mikuroxina/mini-fn";

export class DummyMatchRepository implements MatchRepository {
  private data: Match[];

  constructor() {
    this.data = [];
  }

  public async create(match: Match): Promise<Result.Result<Error, Match>> {
    this.data.push(match);
    return Result.ok(match);
  }
}
