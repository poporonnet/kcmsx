import { Option, Result } from '@mikuroxina/mini-fn';
import { PreMatch, PreMatchID } from '../../model/pre.js';
import { PreMatchRepository } from '../../model/repository.js';

export class DummyPreMatchRepository implements PreMatchRepository {
  private data: PreMatch[];

  constructor(data: PreMatch[] = []) {
    this.data = data;
  }

  public async create(match: PreMatch): Promise<Result.Result<Error, void>> {
    this.data.push(match);
    return Result.ok(undefined);
  }

  public async createBulk(matches: PreMatch[]): Promise<Result.Result<Error, void>> {
    this.data.push(...matches);
    return Result.ok(undefined);
  }

  public async findByID(id: PreMatchID): Promise<Option.Option<PreMatch>> {
    const match = this.data.find((m) => m.getID() === id);
    if (!match) {
      return Option.none();
    }
    return Option.some(match);
  }

  public async update(match: PreMatch): Promise<Result.Result<Error, void>> {
    const i = this.data.findIndex((m) => m.getID() === match.getID());
    this.data[i] = match;
    return Result.ok(undefined);
  }

  public async findAll(): Promise<Result.Result<Error, PreMatch[]>> {
    return Result.ok(this.data);
  }

  /**
   * @description データを置き換え(テスト用)
   * @param data
   */
  public clear(data: PreMatch[] = []) {
    this.data = data;
  }
}
