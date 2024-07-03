import { EntryRepository } from '../../entry/repository.js';
import { Result, Option } from '@mikuroxina/mini-fn';
import { Entry } from '../../entry/entry.js';
import { MatchID, Match, MatchResultFinalPair } from '../match.js';
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
    if (category === 'open') return this.generateOpenMatches();
    const [elementaryRank] = await this.rankingService.handle();

    const elementaryTournament = this.generateTournamentPair(
      this.generateTournament1st(elementaryRank)
    );

    const matches: Match[] = [];
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

    await this.matchRepository.createBulk(matches);

    return Result.ok(matches);
  }

  async generateOpenMatches(): Promise<Result.Result<Error, Match[]>> {
    const openRank = await this.generateOpenTournament();
    const openTournament = this.generateTournamentPair(
      this.generateTournament1st(Result.unwrap(openRank))
    );
    const matches: Match[] = [];
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

  // トーナメントの1回戦を生成する
  private generateTournament1st(ranks: TournamentRank[]): TournamentPermutation {
    // ランキング上位8チームを取得
    ranks = ranks.slice(0, this.FINAL_TOURNAMENT_COUNT);

    const genTournament = (
      ids: TournamentRank[] | Tournament[] | Tournament
    ): TournamentPermutation => {
      if (ids.length === 2) return ids as TournamentPermutation;
      if (ids.length === 0) throw new Error('invalid length');

      const pairs = new Array(ids.length / 2)
        .fill(null)
        .map((_, i) => [ids[i], ids[ids.length - 1 - i]] as Tournament);
      return genTournament(pairs).flat();
    };

    return genTournament(ranks);
  }

  // トーナメントのn回戦を生成する
  public async generateTournamentNth(n: number, category: 'Elementary' | 'Open') {
    // 結果を取得
    const match = await this.matchRepository.findByType('final');
    if (Option.isNone(match)) {
      return Result.err(new Error('Match not found.'));
    }
    // 指定したカテゴリの試合だけ取得
    const categoryMatch = match[1].filter((v) => v.teams.left!.category === category);

    // 終了している試合に絞る
    const finishedMatch = categoryMatch.filter((v) => {
      // 終了している条件: resultsがundefinedでない, results.winnerIDに値がある
      if (v.results === undefined) return false;
      return (v.results as MatchResultFinalPair).winnerID !== undefined;
    });
    // N回戦まで終了しているか
    const finishedN = this.isGenerative(this.FINAL_TOURNAMENT_COUNT, finishedMatch.length);
    if (Result.isErr(finishedN)) {
      return Result.err(finishedN[1]);
    }
    // n回戦まで終了していない場合はエラー
    if (finishedN[1] !== n) {
      return Result.err(new Error('Invalid number of completed matches.'));
    }

    // 試合を生成する
    // 左から2試合ずつ取り出す
    const matches = this.eachSlice(finishedMatch, 2);

    // 取り出したら、その中で勝者を取り出す
    const pickWinner = (match: [Match, Match]): Entry[] => {
      const res: Entry[] = new Array<Entry>();
      for (const v of match) {
        const winnerID = (v.results as MatchResultFinalPair).winnerID;
        if (v.teams.left!.id == winnerID) {
          res.push(v.teams.left!);
        } else {
          res.push(v.teams.right!);
        }
      }
      return res;
    };
    const teamPair: Entry[][] = [];
    for (const v of matches) {
      teamPair.push(pickWinner(v));
    }

    // ペアから試合を作る
    const newMatches: Match[] = [];
    for (const v of teamPair) {
      const id = this.idGenerator.generate<MatchID>();
      if (Result.isErr(id)) {
        return Result.err(id[1]);
      }
      newMatches.push(
        Match.new({
          id: id[1] as MatchID,
          matchType: 'final',
          teams: { left: v[0], right: v[1] },
          courseIndex: 0,
        })
      );
    }
    const res = await this.matchRepository.createBulk(newMatches);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    return Result.ok(newMatches);
  }

  /*
   * @param e エントリー数
   * @param completedMatches 終了した試合数
   * @returns N回戦まで終了
   * */
  public isGenerative(e: number, completedMatches: number): Result.Result<Error, number> {
    // Eが2の冪乗であることを確認
    if (Math.log2(e) % 1 !== 0) {
      return Result.err(new Error(`E must be a power of 2. ${e} is invalid`));
    }

    // 終了した試合数が妥当か検証
    if (completedMatches > e - 1 || completedMatches < 0) {
      return Result.err(new Error(`${completedMatches} is invalid number of completed matches.`));
    }

    // 進行段階を計算
    let rounds = -1; // 全ての試合が終了している場合は-1を返す
    let remainingMatches = e;
    while (remainingMatches > 1) {
      remainingMatches /= 2;
      rounds++;

      if (completedMatches < e - remainingMatches) {
        // 全ての試合が終了していない場合
        break;
      }
    }
    if (completedMatches === e - 1) return Result.ok(-1);
    // 1回戦しかできない場合は0を返す
    if (rounds === 0 && completedMatches < e) {
      return Result.ok(0);
    }

    return Result.ok(rounds);
  }

  private eachSlice = <T, L extends number>(array: T[], size: L) =>
    new Array(array.length / size)
      .fill(0)
      .map((_, i) => array.slice(i * size, (i + 1) * size) as Tuple<T, L>);

  private generateTournamentPair = (
    tournament: TournamentRank[]
  ): [TournamentRank, TournamentRank][] => this.eachSlice(tournament, 2);
}
