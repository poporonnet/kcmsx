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
  it('正しく予選対戦表を生成できる - 部門ごと', async () => {
    const { generateService, preMatchRepository } = createGenerateService([
      ...testTeamData.values(),
    ]);

    const generated = await generateService.generateByDepartment('elementary');
    expect(Result.isOk(generated)).toBe(true);
    const res = Result.unwrap(generated);

    let leftTeams: (string | undefined)[] = [];
    let rightTeams: (string | undefined)[] = [];

    for (const courseIndex of config.match.pre.course.elementary) {
      const filteredByCourse = res.filter((v) => v.getCourseIndex() === courseIndex);
      for (const match of filteredByCourse) {
        // ペアが同じチーム同士でない
        const leftTeam = testTeamData.get(match.getTeamID1() ?? ('' as TeamID))?.getTeamName();
        const rightTeam = testTeamData.get(match.getTeamID2() ?? ('' as TeamID))?.getTeamName();
        expect(leftTeam).not.toStrictEqual(rightTeam);

        leftTeams.push(leftTeam);
        rightTeams.push(rightTeam);
      }
    }

    // 各チーム左右に1回ずつペアになる
    const teamData = [...testTeamData.values()]
      .filter((team) => team.getDepartmentType() === 'elementary')
      .map((team) => team.getTeamName())
      .sort();

    expect(leftTeams.filter((team) => team !== undefined).sort()).toEqual(teamData);
    expect(rightTeams.filter((team) => team !== undefined).sort()).toEqual(teamData);

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
      let leftTeams: (string | undefined)[] = [];
      let rightTeams: (string | undefined)[] = [];

      for (const courseIndex of config.match.pre.course[departmentType]) {
        const filteredByCourse = createdMatches.filter((v) => v.getCourseIndex() === courseIndex);
        for (const match of filteredByCourse) {
          // ペアが同じチーム同士でない
          const leftTeam = testTeamData.get(match.getTeamID1() ?? ('' as TeamID))?.getTeamName();
          const rightTeam = testTeamData.get(match.getTeamID2() ?? ('' as TeamID))?.getTeamName();
          expect(leftTeam).not.toStrictEqual(rightTeam);

          leftTeams.push(leftTeam);
          rightTeams.push(rightTeam);
        }
      }

      // 各チーム左右に1回ずつペアになる
      const teamData = [...testTeamData.values()]
        .filter((team) => team.getDepartmentType() === departmentType)
        .map((team) => team.getTeamName())
        .sort();

      expect(leftTeams.filter((team) => team !== undefined).sort()).toEqual(teamData);
      expect(rightTeams.filter((team) => team !== undefined).sort()).toEqual(teamData);
    }

    const allMatches = [...res.values()].flat();

    // 正しく保存されている
    await Promise.all(
      allMatches.map(async (createdMatch) => {
        const res = await preMatchRepository.findByID(createdMatch.getID());
        expect(res).toSatisfy(Option.isSome);

        const match = Option.unwrap(res);
        expect(match).toStrictEqual(createdMatch);
      })
    );

    // 部門をまたいでコースごとにmatchIndexが連番になっている
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

  it('hotfix: configで指定したコース番号を正しく使う', async () => {
    const { generateService } = createGenerateService([...testTeamData.values()]);
    const generatedRes = await generateService.generateByDepartment('open');

    expect(Result.isOk(generatedRes)).toBe(true);
    for (const v of Result.unwrap(generatedRes)) {
      expect(config.match.pre.course['open']).toContain(v.getCourseIndex());
    }
  });
});
