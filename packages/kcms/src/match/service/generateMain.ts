import { Result } from '@mikuroxina/mini-fn';
import { DepartmentType } from 'config';
import { SnowflakeIDGenerator } from '../../id/main';
import { TeamID } from '../../team/models/team';
import { ChildMatches, MainMatch, MainMatchID } from '../model/main';
import { MainMatchRepository } from '../model/repository';

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
    const requiredTeams = Object.entries(this.requiredTeams).find(([k]) => k === departmentType);
    if (!requiredTeams) {
      return Result.err(new Error('制約が存在しないため、試合を生成できません(未実装)'));
    }

    const requiredTeamCount = requiredTeams[1];
    if (teamIDs.length !== requiredTeamCount) {
      return Result.err(new Error('必要なチーム数に一致しません'));
    }

    const pairRes = this.generateMatchPair(teamIDs);
    if (Result.isErr(pairRes)) {
      return pairRes;
    }
    const pair = Result.unwrap(pairRes);

    const matchesRes = this.generateTournament(pair);
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
  private generateMatchPair(
    teams: TeamID[]
  ): Result.Result<Error, [TeamID | undefined, TeamID | undefined][]> {
    if (teams.length === 2) {
      return Result.ok([[teams[0], teams[1]]] as [TeamID | undefined, TeamID | undefined][]);
    }

    // 1. 4つのグループに分ける
    const splited: [TeamID[], TeamID[], TeamID[], TeamID[]] = [[], [], [], []];
    const chunkSize = Math.floor(teams.length / 4);
    let start = 0;
    for (let i = 0; i < 4; i++) {
      const size = chunkSize + (i < teams.length % 4 ? 1 : 0);
      splited[i] = teams.slice(start, start + size);
      start += size;
    }
    /**
     * 2. 4つのグループを以下のように組み合わせる
     * グループ1-グループ4
     * グループ2-グループ3
     */
    const pairLeft: TeamID[] = [...splited[0], ...splited[1]];
    const pairRight: TeamID[] = [...splited[3], ...splited[2]];
    const ungroupedPair: [TeamID, TeamID][] = [];
    for (let i = 0; i < pairLeft.length; i++) {
      ungroupedPair.push([pairLeft[i], pairRight[i]]);
    }
    /*
     * 3. 順位で並べてグルーピングする
     * グループ数: n/4
     * ToDo: n=4のときは2、n=2のときは1として扱うようにする
     */
    const groupNum = ((n: number) => {
      if (n === 4) return 2;
      if (n === 2) return 1;
      return n / 4;
    })(teams.length);

    const groupedPair: Map<number, [TeamID, TeamID][]> = new Map();
    for (let i = 0; i < ungroupedPair.length; i++) {
      const groupIndex = i % groupNum;
      if (!groupedPair.has(groupIndex)) {
        groupedPair.set(groupIndex, []);
      }
      groupedPair.get(groupIndex)!.push(ungroupedPair[i]);
    }

    return Result.ok([...groupedPair.values()].flat());
  }

  /**
   * トーナメントを生成する
   */
  private generateTournament(
    firstRoundMatches: [TeamID | undefined, TeamID | undefined][]
  ): Result.Result<Error, MainMatch[]> {
    // K: トーナメントのラウンド数(0が決勝) / V: そのラウンドの試合
    const matches: Map<number, MainMatch[]> = new Map();
    // 現在のラウンド数(0だとlog_2が0になるため1からスタート)
    let round = 1;
    /*
      試合を生成

      終了条件:
        - チーム数-1に達した(試合を生成しきった)
      ラウンド終了条件:
        - log_2(これまでの生成数)が変わった

      NOTE: 注意 **ラウンドはトーナメント実行順とは逆方向に数えています(例(n=8):初戦: 2, 準決勝: 1, 決勝: 0)**
    */
    for (let i = 1; i < firstRoundMatches.length * 2; i++) {
      if (Math.floor(Math.log2(i)) != round) {
        round = Math.floor(Math.log2(i));
      }
      if (!matches.has(round)) {
        matches.set(round, []);
      }

      // 試合を生成する
      // ToDo: 試合番号、部門を正しく埋める
      const res = this.generateMainMatch(
        'elementary',
        [undefined, undefined],
        undefined,
        undefined
      );
      if (Result.isErr(res)) {
        return res;
      }
      matches.get(round)!.push(Result.unwrap(res));
    }

    // 最初の試合のチームを埋める
    for (const v of matches.get([...matches].length - 1)!) {
      const pair = firstRoundMatches.shift();
      if (!pair) {
        return Result.err(new Error('ペアがありません'));
      }
      if (pair[0]) v.setTeamID1(pair[0]);
      if (pair[1]) v.setTeamID2(pair[1]);
    }

    for (let i = [...matches].length - 1; 0 <= i; i--) {
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
      if (i !== [...matches].length - 1 && !previousRoundMatches) {
        return Result.err(new Error('前のラウンドの試合がありません'));
      }

      for (const match of currentRoundMatches) {
        if (i !== [...matches].length - 1) {
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
    child: ChildMatches | undefined
  ): Result.Result<Error, MainMatch> {
    const id = this.idGenerator.generate<MainMatch>();
    if (Result.isErr(id)) {
      return id;
    }

    return Result.ok(
      MainMatch.new({
        id: Result.unwrap(id),
        courseIndex: 1,
        matchIndex: 1,
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
