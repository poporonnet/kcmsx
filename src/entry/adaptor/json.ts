import { EntryRepository } from "../repository.js";
import { Option, Result } from "@mikuroxina/mini-fn";
import { Entry } from "../entry.js";
import { writeFile, readFile } from "node:fs/promises";

interface JSONData {
  entry: Array<Entry>;
}

export class JSONEntryRepository implements EntryRepository {
  private readonly data: Array<Entry>;
  private constructor(data?: Array<Entry>) {
    this.data = data ?? [];
  }

  static async new(): Promise<JSONEntryRepository> {
    const data = await this.load();
    return new JSONEntryRepository(data);
  }

  async create(entry: Entry): Promise<Result.Result<Error, Entry>> {
    this.data.push(entry);
    await this.save();
    return Result.ok(entry);
  }

  async findByTeamName(name: string): Promise<Option.Option<Entry>> {
    const entry = this.data.find((e) => e.teamName === name);
    if (entry === undefined) {
      return Option.none();
    }
    return Option.some(entry);
  }

  async findByID(id: string): Promise<Option.Option<Entry>> {
    const entry = this.data.find((e) => e.id === id);
    if (entry === undefined) {
      return Option.none();
    }
    return Option.some(entry);
  }

  async findAll(): Promise<Result.Result<Error, Array<Entry>>> {
    return Result.ok(this.data);
  }

  private async save() {
    const res = await writeFile(
      "./data.json",
      JSON.stringify({ entry: this.data }),
      "utf-8",
    );
    console.log(res, "saved");
  }

  private static async load(): Promise<Entry[]> {
    const data = await readFile("./data.json", "utf-8");
    return (JSON.parse(data) as JSONData).entry;
  }
}
