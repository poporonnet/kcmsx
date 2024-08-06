import { Result } from '@mikuroxina/mini-fn';
import { Team } from '../../entry/models/team.js';
import { TeamRepository } from '../../entry/models/repository.js';
import { PreMatchRepository } from '../model/repository.js';
import { SnowflakeIDGenerator } from '../../id/main.js';
import { PreMatch, PreMatchID } from '../model/pre.js';

export class GeneratePrimaryMatchService {
  private readonly entryRepository: TeamRepository;
  private readonly matchRepository: PreMatchRepository;
  private readonly idGenerator: SnowflakeIDGenerator;
  private readonly COURSE_COUNT = 3;

  constructor(
    entryRepository: TeamRepository,
    matchRepository: PreMatchRepository,
    idGenerator: SnowflakeIDGenerator
  ) {
    this.entryRepository = entryRepository;
    this.matchRepository = matchRepository;
    this.idGenerator = idGenerator;
  }

  /**
   * @description 予選の(全部門)対戦表を生成
   * @returns 生成した対戦表 コースごとにPreMatch[]が入る
   */
  async generatePrimaryMatch(): Promise<Result.Result<Error, PreMatch[][]>> {
    // ToDo: エントリーしていない人を取り除く
    const res = await this.entryRepository.findAll();
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    // 分ける(N/M = A...B M[i]にA人、B人を少ない方から)
    const entry = res[1].filter((v) => v.getCategory() === 'Elementary');
    console.log(entry.length);
    const entryNum = entry.length;
    // コースごとの参加者数
    const entryPerCourse = Math.floor(entryNum / this.COURSE_COUNT);
    // 余り
    const entryRemain = entryNum % this.COURSE_COUNT;

    // 振り分ける
    const courses: Team[][] = [];
    for (let i = 0; i < this.COURSE_COUNT; i++) {
      const course = entry.slice(i * entryPerCourse, (i + 1) * entryPerCourse);
      if (entryRemain > i) {
        course.push(entry[entryPerCourse * this.COURSE_COUNT + i]);
      }
      courses[i] = course;
    }

    const tmpMatches: PreMatch[][] = [];
    for (let i = 0; i < courses.length; i++) {
      const courseMatches: PreMatch[] = [];
      for (let k = 0; k < courses[i].length; k++) {
        const courseLength = courses[i].length;
        const gap = Math.floor(courseLength / 2);
        const opponentIndex = k + gap >= courseLength ? k + gap - courseLength : k + gap;

        const id = this.idGenerator.generate<PreMatch>();
        if (Result.isErr(id)) {
          return Result.err(id[1]);
        }

        const match = PreMatch.new({
          id: id[1] as PreMatchID,
          teamId1: courses[i][k].getId(),
          teamId2: courses[i][opponentIndex].getId(),
          courseIndex: i,
          matchIndex: 0,
          runResults: [],
        });
        courseMatches.push(match);
      }
      tmpMatches.push(courseMatches);
    }

    for (const v of tmpMatches) {
      for (const match of v) {
        await this.matchRepository.create(match);
      }
    }

    return Result.ok(tmpMatches);
  }
}
