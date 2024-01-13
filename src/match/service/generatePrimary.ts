import { Result } from '@mikuroxina/mini-fn';
import { MatchDTO } from './get.js';
import { Entry } from '../../entry/entry.js';
import { Match } from '../match.js';
import crypto from 'crypto';
import { EntryRepository } from '../../entry/repository.js';
import { MatchRepository } from './repository.js';

export class GeneratePrimaryMatchService {
  private readonly entryRepository: EntryRepository;
  private readonly matchRepository: MatchRepository;
  private readonly COURSE_COUNT = 3;

  constructor(entryRepository: EntryRepository, matchRepository: MatchRepository) {
    this.entryRepository = entryRepository;
    this.matchRepository = matchRepository;
  }

  // 予選対戦表の生成
  async generatePrimaryMatch(): Promise<Result.Result<Error, MatchDTO[][]>> {
    const res = await this.entryRepository.findAll();
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    // 分ける(N/M = A...B M[i]にA人、B人を少ない方から)
    const entry = res[1].filter((v) => v.category === 'Elementary');
    console.log(entry.length);
    const entryNum = entry.length;
    // コースごとの参加者数
    const entryPerCourse = Math.floor(entryNum / this.COURSE_COUNT);
    // 余り
    const entryRemain = entryNum % this.COURSE_COUNT;

    // 振り分ける
    const courses: Entry[][] = [];
    for (let i = 0; i < this.COURSE_COUNT; i++) {
      const course = entry.slice(i * entryPerCourse, (i + 1) * entryPerCourse);
      if (entryRemain > i) {
        course.push(entry[entryPerCourse * this.COURSE_COUNT + i]);
      }
      courses[i] = course;
    }

    const tmpMatches: Match[][] = [];
    for (let i = 0; i < courses.length; i++) {
      const courseMatches: Match[] = [];
      for (let k = 0; k < courses[i].length; k++) {
        const courseLength = courses[i].length;
        const gap = Math.floor(courseLength / 2);
        const opponentIndex = k + gap >= courseLength ? k + gap - courseLength : k + gap;
        const match = Match.new({
          id: crypto.randomUUID(),
          matchType: 'primary',
          teams: { left: courses[i][k], right: courses[i][opponentIndex] },
          courseIndex: i,
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

    return Result.ok(tmpMatches.map((v) => v.map(MatchDTO.fromDomain)));
  }
}
