import { Result } from '@mikuroxina/mini-fn';
import { config, DepartmentType } from 'config';
import { SnowflakeIDGenerator } from '../../id/main';
import { TeamID } from '../../team/models/team';
import { ChildMatches, MainMatch, MainMatchID } from '../model/main';
import { MainMatchRepository } from '../model/repository';
import { eachSlice } from '../utility/eachSlice';

export class GenerateMainMatchService {
  constructor(
    private readonly mainMatchRepository: MainMatchRepository,
    private readonly idGenerator: SnowflakeIDGenerator,
    private readonly requiredTeams: Record<string, number>
  ) {}

  async handle(
    departmentType: DepartmentType,
    teamIDs: TeamID[]
  ): Promise<Result.Result<Error, MainMatch[]>> {
    const requiredTeamCount = Object.hasOwn(this.requiredTeams, departmentType)
      ? this.requiredTeams[departmentType]
      : undefined;
    if (requiredTeamCount == null) {
      return Result.err(new Error('制約が存在しないため、試合を生成できません(未実装)'));
    }

    if (teamIDs.length !== requiredTeamCount) {
      return Result.err(new Error('必要なチーム数に一致しません'));
    }

    const pairs = this.generateMatchPair(teamIDs);

    const maxMatchIndexRes = await this.mainMatchRepository.findMaxMatchIndexAll();
    if (Result.isErr(maxMatchIndexRes)) return maxMatchIndexRes;
    const maxMatchIndex = Result.unwrap(maxMatchIndexRes);
    const matchIndexOffset = new Map(
      maxMatchIndex.map(({ courseIndex, matchIndex }) => [courseIndex, matchIndex])
    );

    const matchesRes = this.generateTournament(departmentType, pairs, matchIndexOffset);
    if (Result.isErr(matchesRes)) {
      return matchesRes;
    }
    const matches = Result.unwrap(matchesRes);

    const res = await this.mainMatchRepository.createBulk(matches);
    if (Result.isErr(res)) {
      return res;
    }

    return Result.ok(matches);
  }

  /**
   * トーナメントの初戦で対戦するチームのペアを生成する
   *
   * @param teams 予選順位でソートされたチームID
   * @returns 生成されたペアのリスト
   */
  private generateMatchPair(teams: TeamID[]): [TeamID, TeamID][] {
    const matchPermutation = this.generateMatchPairInternal(teams.map((team) => [team]));

    return eachSlice(matchPermutation, 2) as [TeamID, TeamID][];
  }

  /**
   * {@link generateMatchPair}の内部実装 常に深さ2を保ったまま再帰する
   *
   * @param teams グルーピングされたチームのリスト
   * @returns 生成されたチーム順のリスト
   */
  private generateMatchPairInternal(teams: TeamID[][]): TeamID[] {
    if (teams.length === 2) return teams.flat();

    const groupedTeams = new Array(teams.length / 2)
      .fill(null)
      .map((_, i) => [...teams[i].flat(), ...teams[teams.length - 1 - i].flat()]);
    return this.generateMatchPairInternal(groupedTeams);
  }

  /**
   * トーナメントを生成する
   */
  private generateTournament(
    departmentType: DepartmentType,
    firstRoundMatches: [TeamID, TeamID][],
    matchIndexOffsets: Map<number, number>
  ): Result.Result<Error, MainMatch[]> {
    // K: トーナメントのラウンド(0が初戦) / V: そのラウンドの試合
    const matches: Map<number, MainMatch[]> = new Map();
    // トーナメントのチーム数
    const teamCount = firstRoundMatches.length * 2;
    // トーナメントの試合数
    const matchCount = teamCount - 1;
    // トーナメントのラウンド数
    const roundCount = Math.floor(Math.log2(teamCount));

    // K: コース番号 / V: そのコースの試合番号
    const matchIndexes: Map<number, number> = new Map(
      config.match.main.course[departmentType].map((courseIndex) => [
        courseIndex,
        (matchIndexOffsets?.get(courseIndex) ?? 0) + 1,
      ])
    );
    let courseIndex = 0;

    /*
      試合を生成

      NOTE: ラウンドはトーナメント実行順に数えています(例(n=8):初戦: 0, 準決勝: 1, 決勝: 2)
            算出: ラウンド数 - floor(log_2(残りの試合数)) - 1 (0-indexed)
            例(8チームでの最初の試合の場合): 3ラウンド - floor(log_2(7試合 - 0番目)) - 1 = 0ラウンド目
    */
    for (let matchNumber = 0; matchNumber < matchCount; matchNumber++) {
      const round = roundCount - Math.floor(Math.log2(matchCount - matchNumber)) - 1;
      // 新しいラウンド
      if (!matches.has(round)) {
        courseIndex = 0;
      }

      const course = config.match.main.course[departmentType][courseIndex];
      const matchIndex = matchIndexes.get(course)!;
      matchIndexes.set(course, matchIndex + 1);
      courseIndex = (courseIndex + 1) % config.match.main.course[departmentType].length;

      const res = this.generateMainMatch(
        departmentType,
        [undefined, undefined],
        undefined,
        undefined,
        matchIndex,
        course
      );
      if (Result.isErr(res)) {
        return res;
      }
      matches.set(round, [...(matches.get(round) ?? []), Result.unwrap(res)]);
    }

    // 最初の試合のチームを埋める
    for (const [i, match] of matches.get(0)!.entries()) {
      const pair = firstRoundMatches.at(i);
      if (!pair) {
        return Result.err(new Error('ペアがありません'));
      }

      if (pair[0]) match.setTeamID1(pair[0]);
      if (pair[1]) match.setTeamID2(pair[1]);
    }

    // 試合の親子関係を設定
    for (const [round, currentRoundMatches] of matches) {
      const previousRoundMatches = matches.get(round - 1);
      const nextRoundMatches = matches.get(round + 1);
      if (round > 0 && !previousRoundMatches) {
        return Result.err(new Error('前のラウンドの試合がありません'));
      }
      if (round < roundCount - 1 && !nextRoundMatches) {
        return Result.err(new Error('次のラウンドの試合がありません'));
      }

      // 前のラウンドの試合をペアに分割したもの
      const previousRoundMatchPairs = previousRoundMatches
        ? eachSlice(previousRoundMatches, 2)
        : undefined;
      for (const [i, match] of currentRoundMatches.entries()) {
        // 最初のラウンドでない場合、子試合を設定
        if (round > 0) {
          const children = previousRoundMatchPairs!.at(i);
          if (children?.length !== 2) {
            return Result.err(new Error('前のラウンドの試合が2つありません'));
          }

          match.setChildMatches({
            match1: children[0],
            match2: children[1],
          });
        }
        // 最後のラウンドでない場合、親試合を設定
        if (round < roundCount - 1) {
          const parent = nextRoundMatches!.at(i / 2);
          if (!parent) {
            return Result.err(new Error('次のラウンドの試合がありません'));
          }
          match.setParentID(parent.getID());
        }
      }
    }

    return Result.ok([...matches.values()].flat());
  }

  // ファクトリー関数
  private generateMainMatch(
    departmentType: DepartmentType,
    pair: [TeamID | undefined, TeamID | undefined],
    parent: MainMatchID | undefined,
    child: ChildMatches | undefined,
    matchIndex: number,
    courseIndex: number
  ): Result.Result<Error, MainMatch> {
    const id = this.idGenerator.generate<MainMatch>();
    if (Result.isErr(id)) {
      return id;
    }

    return Result.ok(
      MainMatch.new({
        id: Result.unwrap(id),
        courseIndex,
        matchIndex,
        departmentType: departmentType,
        teamID1: pair[0],
        teamID2: pair[1],
        runResults: [],
        winnerID: undefined,
        parentMatchID: parent,
        childMatches: child,
      })
    );
  }
}
