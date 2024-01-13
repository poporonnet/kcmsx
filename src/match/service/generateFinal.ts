import { EntryRepository } from '../../entry/repository.js';
import { Result } from '@mikuroxina/mini-fn';
import { Entry } from '../../entry/entry.js';
import { MatchID, Match } from '../match.js';
import { MatchRepository } from './repository.js';
import { GenerateRankingService } from './generateRanking.js';
import { SnowflakeIDGenerator } from '../../id/main.js';

export type TournamentRank = {
  rank: number;
  points: number;
  time: number;
  entry: Entry;
};
export type Tournament = [TournamentRank, TournamentRank] | [Tournament, Tournament];
type TournamentPermutation = TournamentRank[];
type BaseTuple<T, L extends number, Tup extends T[] = []> = Tup['length'] extends L
  ? Tup
  : BaseTuple<T, L, [T, ...Tup]>;
type Tuple<T, L extends number> = BaseTuple<T, L>;

export class GenerateFinalMatchService {
  private readonly FINAL_TOURNAMENT_COUNT = 8;
  private readonly entryRepository: EntryRepository;
  private readonly matchRepository: MatchRepository;
  private readonly rankingService: GenerateRankingService;
  private readonly idGenerator: SnowflakeIDGenerator;

  constructor(
    entryRepository: EntryRepository,
    matchRepository: MatchRepository,
    rankingService: GenerateRankingService,
    idGenerator: SnowflakeIDGenerator
  ) {
    this.entryRepository = entryRepository;
    this.matchRepository = matchRepository;
    this.rankingService = rankingService;
    this.idGenerator = idGenerator;
  }

  async handle(category: 'elementary' | 'open'): Promise<Result.Result<Error, Match[]>> {
    /*
    初期対戦表を生成
    1 vs 8, 4 vs 5, 2 vs 7, 3 vs 6 (数字は順位)
     */

    const [elementaryRank] = await this.rankingService.handle();
    const openRank = await this.generateOpenTournament();
    const [elementaryTournament, openTournament] = [
      this.generateTournamentPair(this.generateTournament(elementaryRank)),
      // fixme: unwrapやめる
      this.generateTournamentPair(this.generateTournament(Result.unwrap(openRank))),
    ];

    const matches: Match[] = [];
    if (category === 'elementary') {
      for (const v of elementaryTournament) {
        const id = this.idGenerator.generate<MatchID>();
        if (Result.isErr(id)) {
          return Result.err(id[1]);
        }

        matches.push(
          Match.new({
            id: id[1] as MatchID,
            matchType: 'final',
            teams: { left: v[0].entry, right: v[1].entry },
            courseIndex: 0,
          })
        );
      }
    } else {
      for (const v of openTournament) {
        const id = this.idGenerator.generate<MatchID>();
        if (Result.isErr(id)) {
          return Result.err(id[1]);
        }
        matches.push(
          Match.new({
            id: id[1] as MatchID,
            matchType: 'final',
            teams: { left: v[0].entry, right: v[1].entry },
            courseIndex: 0,
          })
        );
      }
    }

    await this.matchRepository.createBulk(matches);

    return Result.ok(matches);
  }

  // generateOpenTournament オープン部門は予選を行わないのでランキング(?)を無理やり作る
  private async generateOpenTournament(): Promise<Result.Result<Error, TournamentRank[]>> {
    const res = await this.entryRepository.findAll();
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    return Result.ok(
      res[1]
        .filter((v) => v.category === 'Open')
        .map((v, i): TournamentRank => {
          return {
            rank: i,
            points: 0,
            time: 0,
            entry: v,
          };
        })
    );
  }

  private generateTournament(ranks: TournamentRank[]): TournamentPermutation {
    // ランキング上位8チームを取得
    ranks = ranks.slice(0, this.FINAL_TOURNAMENT_COUNT);

    const genTournament = (
      ids: TournamentRank[] | Tournament[] | Tournament
    ): TournamentPermutation => {
      if (ids.length == 2) return ids as TournamentPermutation;

      const pairs = new Array(ids.length / 2)
        .fill(null)
        .map((_, i) => [ids[i], ids[ids.length - 1 - i]] as Tournament);
      return genTournament(pairs).flat();
    };

    return genTournament(ranks);
  }

  private eachSlice = <T, L extends number>(array: T[], size: L) =>
    new Array(array.length / size)
      .fill(0)
      .map((_, i) => array.slice(i * size, (i + 1) * size) as Tuple<T, L>);

  private generateTournamentPair = (
    tournament: TournamentRank[]
  ): [TournamentRank, TournamentRank][] => this.eachSlice(tournament, 2);
}
