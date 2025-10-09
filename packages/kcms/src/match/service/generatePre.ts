import { Result } from '@mikuroxina/mini-fn';
import { config, DepartmentType } from 'config';
import { SnowflakeIDGenerator } from '../../id/main';
import { Team } from '../../team/models/team';
import { FetchTeamService } from '../../team/service/fetchTeam';
import { PreMatch } from '../model/pre';
import { PreMatchRepository } from '../model/repository';

export class GeneratePreMatchService {
  constructor(
    private readonly fetchTeam: FetchTeamService,
    private readonly idGenerator: SnowflakeIDGenerator,
    private readonly preMatchRepository: PreMatchRepository
  ) {}

  async generateByDepartment(
    departmentType: DepartmentType
  ): Promise<Result.Result<Error, PreMatch[]>> {
    if (!config.match.pre.course[departmentType]) {
      return Result.err(new Error('DepartmentType is not defined'));
    }
    const pairs = await this.makePairs(departmentType);
    const matchRes = await this.makeMatches(pairs, departmentType);
    if (Result.isErr(matchRes)) {
      return matchRes;
    }

    const match = Result.unwrap(matchRes);
    const res = await this.preMatchRepository.createBulk(match);
    if (Result.isErr(res)) {
      return res;
    }

    return Result.ok(match);
  }

  async generateAll(): Promise<Result.Result<Error, Map<DepartmentType, PreMatch[]>>> {
    const matches = new Map<DepartmentType, PreMatch[]>();
    const matchIndexOffset = new Map<number, number>();

    for (const departmentType of config.departmentTypes) {
      const pairs = await this.makePairs(departmentType);
      const matchRes = await this.makeMatches(pairs, departmentType, matchIndexOffset);
      if (Result.isErr(matchRes)) {
        return matchRes;
      }

      const deptMatches = Result.unwrap(matchRes);
      matches.set(departmentType, deptMatches);
    }

    const allMatches = [...matches.values()].flat();
    const res = await this.preMatchRepository.createBulk(allMatches);
    if (Result.isErr(res)) {
      return res;
    }

    return Result.ok(matches);
  }

  private async makeMatches(
    data: (Team | undefined)[][][],
    departmentType: DepartmentType,
    matchIndexOffset: Map<number, number> = new Map()
  ): Promise<Result.Result<Error, PreMatch[]>> {
    // 与えられたペアをもとに試合を生成する

    // ペアが空ならエラー
    if (data.length <= 0) {
      return Result.err(new Error('pair is Empty'));
    }

    // コースごとに生成
    const generated = data.map((course, courseIndex) => {
      const courseNumber = config.match.pre.course[departmentType][courseIndex];
      if (!matchIndexOffset.has(courseNumber)) {
        matchIndexOffset.set(courseNumber, 0);
      }

      // ペアをもとに試合を生成
      return course.map((pair): Result.Result<Error, PreMatch> => {
        const id = this.idGenerator.generate<PreMatch>();
        if (Result.isErr(id)) {
          return id;
        }

        const matchIndex = (matchIndexOffset.get(courseNumber) ?? 0) + 1;
        const match = PreMatch.new({
          id: Result.unwrap(id),
          // ToDo: 他部門のコースがすでに使用されているときにコース番号をどうするかを考える
          courseIndex: courseIndex + 1,
          matchIndex: matchIndex,
          departmentType: (pair[0] || pair[1]!).getDepartmentType(),
          teamID1: pair[0]?.getID(),
          teamID2: pair[1]?.getID(),
          runResults: [],
        });

        matchIndexOffset.set(courseNumber, matchIndex);
        return Result.ok(match);
      });
    });
    const flatten = generated.flat();
    const match = flatten.filter((v) => Result.isOk(v)).map((v) => Result.unwrap(v));

    return Result.ok(match);
  }

  /**
   * チームのペアだけを作る関数
   */
  async makePairs(departmentType: DepartmentType): Promise<(Team | undefined)[][][]> {
    // 多言語環境でソート可能にするためにcollatorを使う
    const collator = new Intl.Collator('ja');
    const courseCount = config.match.pre.course[departmentType].length;

    // エントリー済みのチームを取得
    const teamRes = await this.fetchTeam.findAll();
    if (Result.isErr(teamRes)) {
      return [];
    }
    const team = Result.unwrap(teamRes).filter(
      (v) => v.getIsEntered() && v.getDepartmentType() === departmentType
    );

    if (team.length <= 0) {
      return [];
    }

    // チームをクラブ名でソートする (ToDo: クラブ名がない場合にどこの位置に動かすかを決める必要がありそう
    const teams = team.sort((a, b) =>
      collator.compare(a.getClubName() ?? 'N', b.getClubName() ?? 'N')
    );

    // コースの数でスライスする
    // 初期化時に必要な個数作っておく
    const slicedTeams: Team[][] = new Array(
      Math.ceil(teams.length / config.match.pre.course[departmentType].length)
    ).fill([]);
    for (let i = 0; i < Math.ceil(teams.length / courseCount); i++) {
      // コース数
      slicedTeams[i] = teams.slice(i * courseCount, (i + 1) * courseCount);
    }

    /* スライスされた配列を転置する
     * 列数 != 行数の場合、undefinedが入るので、filterで除外している
     */
    const transpose = slicedTeams[0]
      .map((_, i) => slicedTeams.map((r) => r[i]))
      .map((r) => r.filter((v) => v !== undefined));

    // 配列の要素ごとに、右側のコースを走る相手を決める
    return transpose.map((v) => {
      if (v.length === 1) {
        console.warn('WANING: 1チームだけのコースがあります');
        return [
          [v[0], undefined],
          [undefined, undefined],
          [undefined, v[0]],
        ];
      } else if (v.length === 2) {
        console.warn('WANING: 2チームだけのコースがあります');
        return [
          [v[0], v[1]],
          [undefined, undefined],
          [v[1], v[0]],
        ];
      } else if (v.length === 3) {
        console.warn('WANING: 3チームだけのコースがあります');
        return [
          [v[0], v[2]],
          [v[1], undefined],
          [undefined, v[0]],
          [v[2], v[1]],
        ];
      } else {
        // ずらす数(floor(配列の長さ/2))
        const shift = Math.floor(v.length / 2);
        // ずらした配列を作成
        const shifted = v.slice(shift).concat(v.slice(0, shift));
        // ペアを作る
        return v.map((_, i) => [v[i], shifted[i]]);
      }
    });
  }
}
