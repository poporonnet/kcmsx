import { MatchRepository } from './repository.js';
import { Option, Result } from '@mikuroxina/mini-fn';
import { Match, MatchResultFinalPair, MatchResultPair, MatchTeams } from '../match.js';

export class GetMatchService {
  private readonly repository: MatchRepository;

  constructor(repository: MatchRepository) {
    this.repository = repository;
  }

  async findById(id: string): Promise<Result.Result<Error, MatchDTO>> {
    const res = await this.repository.findByID(id);
    if (Option.isNone(res)) {
      return Result.err(new Error('Not found'));
    }

    return Result.ok(MatchDTO.fromDomain(res[1]));
  }

  async findByType(type: string): Promise<Result.Result<Error, MatchDTO[]>> {
    const res = await this.repository.findByType(type);
    if (Option.isNone(res)) {
      return Result.err(new Error('Not found'));
    }

    return Result.ok(res[1].map(MatchDTO.fromDomain));
  }
}

export class MatchDTO {
  // 試合ID
  private readonly _id: string;
  // 試合するチームのID
  private readonly _teams: MatchTeams;
  // 試合種別 primary: 予選, final: 本選
  private readonly _matchType: 'primary' | 'final';
  // コース番号
  private readonly _courseIndex: number;
  // 試合の結果
  private readonly _results?: MatchResultPair | MatchResultFinalPair;
  get id(): string {
    return this._id;
  }

  get teams(): MatchTeams {
    return this._teams;
  }

  get matchType(): 'primary' | 'final' {
    return this._matchType;
  }

  get courseIndex(): number {
    return this._courseIndex;
  }

  get results(): MatchResultPair | MatchResultFinalPair | undefined {
    return this._results;
  }

  private constructor(
    id: string,
    teams: MatchTeams,
    matchType: 'primary' | 'final',
    courseIndex: number,
    results?: MatchResultPair | MatchResultFinalPair
  ) {
    this._id = id;
    this._teams = teams;
    this._matchType = matchType;
    this._courseIndex = courseIndex;
    this._results = results;
  }

  public static fromDomain(match: Match): MatchDTO {
    return new MatchDTO(match.id, match.teams, match.matchType, match.courseIndex, match.results);
  }

  public toDomain(): Match {
    return Match.reconstruct({
      id: this._id,
      teams: this._teams,
      matchType: this._matchType,
      courseIndex: this._courseIndex,
      results: this._results,
    });
  }
}
