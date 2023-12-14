import { Match } from "../match.js";
import { MatchRepository } from "../service/repository.js";
import { Result } from "@mikuroxina/mini-fn";
import { readFile, writeFile } from "node:fs/promises";

interface JSONData {
  match: Array<Match>;
}

export class JSONMatchRepository implements MatchRepository {
  private readonly data: Match[];

  private constructor(data?: Array<Match>) {
    this.data = data ?? [];
  }

  async new(): Promise<JSONMatchRepository> {
    const data = await this.load();
    return new JSONMatchRepository(data);
  }

  public async create(match: Match): Promise<Result.Result<Error, Match>> {
    this.data.push(match);
    await this.save();
    return Result.ok(match);
  }

  private async save() {
    await writeFile("./match.json", JSON.stringify(this.data), "utf-8");
  }

  private async load(): Promise<Match[]> {
    const data = await readFile("./match.json", "utf-8");
    return (JSON.parse(data) as JSONData).match;
  }
}
