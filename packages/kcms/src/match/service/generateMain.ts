import { Result } from '@mikuroxina/mini-fn';
import { config, DepartmentType } from 'config';
import { SnowflakeIDGenerator } from '../../id/main';
import { TeamID } from '../../team/models/team';
import { ChildMatches, MainMatch, MainMatchID } from '../model/main';
import { MainMatchRepository } from '../model/repository';

type MatchPair = [TeamID, TeamID] | [MatchPair, MatchPair];

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

    const pairRes = this.generateMatchPair(teamIDs);
    const pair = ((id: TeamID[]): [TeamID, TeamID][] => {
      const res: [TeamID, TeamID][] = [];
      // note: shift()は破壊的な操作なので、idをfor文の条件に使うと予期しない動作をする
      const teamCount = id.length;
      for (let i = 0; i < teamCount; i += 2) {
        res.push([id.shift()!, id.shift()!]);
      }
      return res;
    })(pairRes);

    const matchesRes = this.generateTournament(departmentType, pair);
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
  private generateMatchPair(teams: TeamID[] | MatchPair[] | MatchPair): TeamID[] {
    if (teams.length === 2) return teams as TeamID[];

    const pairs = new Array(teams.length / 2)
      .fill(null)
      .map((_, i) => [teams[i], teams[teams.length - 1 - i]] as MatchPair);
    return this.generateMatchPair(pairs).flat();
  }

  /**
   * トーナメントを生成する
   */
  private generateTournament(
    departmentType: DepartmentType,
    firstRoundMatches: [TeamID, TeamID][]
  ): Result.Result<Error, MainMatch[]> {
    // K: トーナメントのラウンド数(0が決勝) / V: そのラウンドの試合
    const matches: Map<number, MainMatch[]> = new Map();
    // 現在のラウンド数(0だとlog_2が-Infinityになるため1からスタート)
    let round = Math.floor(Math.log2(firstRoundMatches.length));
    /*
      試合を生成

      終了条件:
        - チーム数-1に達した(試合を生成しきった)
      ラウンド終了条件:
        - log_2(これまでの生成数)が変わった

      NOTE: 注意 **ラウンドはトーナメント実行順とは逆方向に数えています(例(n=8):初戦: 2, 準決勝: 1, 決勝: 0)**
    */
    // K: コース番号 / V: そのコースの試合番号
    const matchIndexes: Map<number, number> = new Map(
      config.match.main.course[departmentType].map((v) => [v, 1])
    );
    let courseIndex = 0;
    for (let i = firstRoundMatches.length * 2 - 1; i > 0; i--) {
      if (Math.floor(Math.log2(i)) != round) {
        round = Math.floor(Math.log2(i));
        courseIndex = 0;
      }
      if (!matches.has(round)) {
        matches.set(round, []);
      }

      if (courseIndex === config.match.main.course[departmentType].length) {
        courseIndex = 0;
      }

      // 試合番号を生成する
      const course = config.match.main.course[departmentType][courseIndex];
      const matchIndex = matchIndexes.get(course)!;
      matchIndexes.set(course, matchIndex + 1);
      courseIndex++;

      // 試合を生成する
      const res = this.generateMainMatch(
        departmentType,
        [undefined, undefined],
        undefined,
        undefined,
        matchIndex,
        courseIndex
      );
      if (Result.isErr(res)) {
        return res;
      }
      matches.get(round)!.push(Result.unwrap(res));
    }

    // 最初の試合のチームを埋める
    for (const v of matches.get(matches.size - 1)!) {
      const pair = firstRoundMatches.shift();
      if (!pair) {
        return Result.err(new Error('ペアがありません'));
      }
      if (pair[0]) v.setTeamID1(pair[0]);
      if (pair[1]) v.setTeamID2(pair[1]);
    }

    for (let i = matches.size - 1; i >= 0; i--) {
      /** 生成手順
       * 1. 自分のIDをparentに持つ試合を、前のラウンドのIDリストから取りして、childにセットする
       *   - i=0のときはなにもしない
       *   - 2個にならない場合は終了する
       * 2. 左から2こずつ試合を取り出して、上のラウンドのIDリストから1つとってくる(parentIDにセット)
       *  - 最終ラウンド(決勝)なら、parentはundefinedにする
       * 3. 1-2を繰り返す
       */

      const currentRoundMatches = matches.get(i);
      if (!currentRoundMatches) {
        return Result.err(new Error('試合がありません'));
      }
      const previousRoundMatches = matches.get(i + 1);
      if (i !== matches.size - 1 && !previousRoundMatches) {
        return Result.err(new Error('前のラウンドの試合がありません'));
      }

      for (const match of currentRoundMatches) {
        if (i !== matches.size - 1) {
          // 自分のIDをparentに持つ試合を前のラウンドのidリストから取りだす
          const child = previousRoundMatches!.filter((v) => v.getParentID() === match.getID());
          if (child.length !== 2) return Result.err(new Error('前のラウンドの試合が2つありません'));
          match.setChildMatches({
            match1: child[0],
            match2: child[1],
          });
        }
      }

      const nextRoundMatchID = matches.get(i - 1)?.map((v) => v.getID());
      if (i !== 0 && !nextRoundMatchID) {
        return Result.err(new Error('次のラウンドの試合がありません'));
      }
      // 全部読み切ったら抜ける
      if (!nextRoundMatchID) {
        break;
      }

      // 左から2こずつ試合を取り出して、上のラウンドのIDリストから1つとってくる(parentIDにセット)
      for (let j = 0; j < currentRoundMatches.length; j += 2) {
        const pair = currentRoundMatches.slice(j, j + 2);
        const parent = nextRoundMatchID!.shift();

        if (!parent) return Result.err(new Error('次のラウンドのIDを読み切りました'));
        pair[0].setParentID(parent);
        pair[1].setParentID(parent);
      }
    }

    return Result.ok([...matches.entries()].map((v) => v[1]).flat());
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
