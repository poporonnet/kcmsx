import { Match } from '../match.js';
import { MatchRepository } from '../service/repository.js';
import { Option, Result } from '@mikuroxina/mini-fn';

export class DummyMatchRepository implements MatchRepository {
  private data: Match[];

  constructor(data?: Match[]) {
    this.data = data ?? [];
  }

  public async create(match: Match): Promise<Result.Result<Error, Match>> {
    this.data.push(match);
    return Result.ok(match);
  }

  public async createBulk(matches: Match[]): Promise<Result.Result<Error, Match[]>> {
    this.data.push(...matches);
    return Result.ok(matches);
  }

  public async findByID(id: string): Promise<Option.Option<Match>> {
    const match = this.data.find((m) => m.id === id);
    if (!match) {
      return Option.none();
    }
    return Option.some(match);
  }

  public async findByType(type: string): Promise<Option.Option<Match[]>> {
    const match = this.data.filter((m) => m.matchType === type);
    if (!match) {
      return Option.none();
    }
    return Option.some(match);
  }

  public async update(match: Match): Promise<Result.Result<Error, Match>> {
    const i = this.data.findIndex((m) => m.id === match.id);
    this.data[i] = match;
    return Result.ok(match);
  }

  public async findAll(): Promise<Result.Result<Error, Match[]>> {
    return Result.ok(this.data);
  }

  public clear() {
    this.data = [];
  }
}
