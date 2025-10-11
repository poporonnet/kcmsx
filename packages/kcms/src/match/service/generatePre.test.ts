import { Option, Result } from '@mikuroxina/mini-fn';
import { config } from 'config';
import { describe, expect, it } from 'vitest';
import { SnowflakeIDGenerator } from '../../id/main';
import { DummyRepository } from '../../team/adaptor/repository/dummyRepository';
import { Team, TeamID } from '../../team/models/team';
import { FetchTeamService } from '../../team/service/fetchTeam';
import { testTeamData } from '../../testData/entry';
import { DummyPreMatchRepository } from '../adaptor/dummy/preMatchRepository';
import { PreMatch } from '../model/pre';
import { GeneratePreMatchService } from './generatePre';

const createGenerateService = (teamData: Team[]) => {
  const teamRepository = new DummyRepository(teamData);
  const fetchService = new FetchTeamService(teamRepository);
  const generator = new SnowflakeIDGenerator(1, () =>
    BigInt(new Date('2024/01/01 00:00:00 UTC').getTime())
  );
  const preMatchRepository = new DummyPreMatchRepository();
  const generateService = new GeneratePreMatchService(fetchService, generator, preMatchRepository);

  return { generateService, preMatchRepository };
};

describe('GeneratePreMatchService', () => {
  const expectedTeamPair = [
    [
      ['A1', 'B3'],
      ['A3', 'C2'],
      ['B1', 'N2'],
      ['B3', 'A1'],
      ['C2', 'A3'],
      ['N2', 'B1'],
    ],
    [
      ['A2', 'B2'],
      ['A4', 'C1'],
      ['B2', 'N1'],
      ['C1', 'A2'],
      ['N1', 'A4'],
    ],
  ];

  it('正しく予選対戦表を生成できる - 部門ごと', async () => {
    const { generateService, preMatchRepository } = createGenerateService([
      ...testTeamData.values(),
    ]);

    const generated = await generateService.generateByDepartment('elementary');
    expect(Result.isOk(generated)).toBe(true);
    const res = Result.unwrap(generated);

    for (let i = 0; i < config.match.pre.course.elementary.length; i++) {
      const course = res.filter((v) => v.getCourseIndex() === i + 1);
      const pairs = course.map((v) => [
        testTeamData.get(v.getTeamID1() ?? ('' as TeamID))?.getTeamName(),
        testTeamData.get(v.getTeamID2() ?? ('' as TeamID))?.getTeamName(),
      ]);
      expect(pairs).toStrictEqual(expectedTeamPair[i]);
    }

    await Promise.all(
      res.map(async (createdMatch) => {
        const res = await preMatchRepository.findByID(createdMatch.getID());
        expect(res).toSatisfy(Option.isSome);

        const match = Option.unwrap(res);
        expect(match).toStrictEqual(createdMatch);
      })
    );
  });

  it('正しく予選対戦表を生成できる - すべての部門', async () => {
    const { generateService, preMatchRepository } = createGenerateService([
      ...testTeamData.values(),
    ]);

    const generated = await generateService.generateAll();
    expect(Result.isOk(generated)).toBe(true);
    const res = Result.unwrap(generated);

    for (const [departmentType, createdMatches] of res) {
      for (let i = 0; i < config.match.pre.course[departmentType].length; i++) {
        const course = createdMatches.filter((v) => v.getCourseIndex() === i + 1);
        const pairs = course.map((v) => [
          testTeamData.get(v.getTeamID1() ?? ('' as TeamID))?.getTeamName(),
          testTeamData.get(v.getTeamID2() ?? ('' as TeamID))?.getTeamName(),
        ]);
        expect(pairs).toStrictEqual(expectedTeamPair[i]);
      }
    }

    const allMatches = [...res.values()].flat();

    await Promise.all(
      allMatches.map(async (createdMatch) => {
        const res = await preMatchRepository.findByID(createdMatch.getID());
        expect(res).toSatisfy(Option.isSome);

        const match = Option.unwrap(res);
        expect(match).toStrictEqual(createdMatch);
      })
    );

    // 部門をまたいでコースごとにmatchIndexが連番になっていることを確認
    const matchesByCourse = new Map<number, PreMatch[]>();
    for (const match of allMatches) {
      const courseIndex = match.getCourseIndex();
      const matches = matchesByCourse.get(courseIndex) ?? [];
      matches.push(match);
      if (!matchesByCourse.has(courseIndex)) {
        matchesByCourse.set(courseIndex, matches);
      }
    }
    for (const matches of matchesByCourse.values()) {
      const index = matches.map((match) => match.getMatchIndex()).sort((a, b) => a - b);
      const expected = Array.from({ length: index.length }, (_, i) => i + 1);

      expect(index).toStrictEqual(expected);
    }
  });

  it('どちらかが不足していると全体が失敗する', async () => {
    const testTeams = [...testTeamData.values()].filter(
      (team) => team.getDepartmentType() !== 'elementary'
    );
    const { generateService, preMatchRepository } = createGenerateService(testTeams);

    const generated = await generateService.generateAll();
    expect(Result.isErr(generated)).toBe(true);

    const res = await preMatchRepository.findAll();
    expect(Result.unwrap(res)).toStrictEqual([]);
  });
});
