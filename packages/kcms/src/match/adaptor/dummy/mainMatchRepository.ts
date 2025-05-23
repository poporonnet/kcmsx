import { Option, Result } from '@mikuroxina/mini-fn';
import { MainMatch, MainMatchID } from '../../model/main.js';
import { MainMatchRepository } from '../../model/repository.js';

export class DummyMainMatchRepository implements MainMatchRepository {
  private data: MainMatch[];

  constructor(data: MainMatch[] = []) {
    this.data = data;
  }

  public async create(match: MainMatch): Promise<Result.Result<Error, void>> {
    this.data.push(match);
    return Result.ok(undefined);
  }

  public async createBulk(matches: MainMatch[]): Promise<Result.Result<Error, void>> {
    this.data.push(...matches);
    return Result.ok(undefined);
  }

  public async findByID(id: MainMatchID): Promise<Option.Option<MainMatch>> {
    const match = this.data.find((m) => m.getID() === id);
    if (!match) {
      return Option.none();
    }
    return Option.some(match);
  }

  public async update(match: MainMatch): Promise<Result.Result<Error, void>> {
    const i = this.data.findIndex((m) => m.getID() === match.getID());
    this.data[i] = match;
    return Result.ok(undefined);
  }

  public async findAll(): Promise<Result.Result<Error, MainMatch[]>> {
    return Result.ok(this.data);
  }

  public clear(data: MainMatch[] = []) {
    this.data = data;
  }
}
