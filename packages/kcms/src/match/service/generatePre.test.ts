import { Option, Result } from '@mikuroxina/mini-fn';
import { describe, expect, it } from 'vitest';
import { SnowflakeIDGenerator } from '../../id/main';
import { DummyRepository } from '../../team/adaptor/repository/dummyRepository';
import { Team, TeamID } from '../../team/models/team';
import { FetchTeamService } from '../../team/service/fetchTeam';
import { testTeamData } from '../../testData/entry';
import { DummyPreMatchRepository } from '../adaptor/dummy/preMatchRepository';
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

    const leftTeamNames: string[] = [];
    const rightTeamNames: string[] = [];

    for (const match of res) {
      // ペアが同じチーム同士でない
      const leftTeamName = testTeamData.get(match.getTeamID1() ?? ('' as TeamID))?.getTeamName();
      const rightTeamName = testTeamData.get(match.getTeamID2() ?? ('' as TeamID))?.getTeamName();
      expect(leftTeamName).not.toStrictEqual(rightTeamName);

      if (leftTeamName != null) {
        leftTeamNames.push(leftTeamName);
      }
      if (rightTeamName != null) {
        rightTeamNames.push(rightTeamName);
      }
    }

    // 各チーム左右に1回ずつペアになる
    const teamNames = [...testTeamData.values()]
      .filter((team) => team.getDepartmentType() === 'elementary')
      .map((team) => team.getTeamName())
      .sort();

    expect(leftTeamNames.sort()).toEqual(teamNames);
    expect(rightTeamNames.sort()).toEqual(teamNames);

    // 正しく保存されている
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
      const leftTeams: string[] = [];
      const rightTeams: string[] = [];

      for (const match of createdMatches) {
        // ペアが同じチーム同士でない
        const leftTeam = testTeamData.get(match.getTeamID1() ?? ('' as TeamID))?.getTeamName();
        const rightTeam = testTeamData.get(match.getTeamID2() ?? ('' as TeamID))?.getTeamName();
        expect(leftTeam).not.toStrictEqual(rightTeam);

        if (leftTeam != null) {
          leftTeams.push(leftTeam);
        }
        if (rightTeam != null) {
          rightTeams.push(rightTeam);
        }
      }

      // 各チーム左右に1回ずつペアになる
      const teamData = [...testTeamData.values()]
        .filter((team) => team.getDepartmentType() === departmentType)
        .map((team) => team.getTeamName())
        .sort();

      expect(leftTeams.sort()).toEqual(teamData);
      expect(rightTeams.sort()).toEqual(teamData);
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
  });

  it('部門をまたいでもコースごとの試合番号が連番になる - 部門ごと', async () => {
    const { generateService, preMatchRepository } = createGenerateService([
      ...testTeamData.values(),
    ]);
    expect(await generateService.generateByDepartment('elementary')).satisfy(Result.isOk);
    //expect(await generateService.generateByDepartment('open')).satisfy(Result.isOk);

    const matchesRes = await preMatchRepository.findAll();
    expect(matchesRes).satisfy(Result.isOk);
    const matches = Result.unwrap(matchesRes);

    const matchIndexes = matches.reduce<Map<number, number[]>>((prev, match) => {
      const matchIndexes = prev.get(match.getCourseIndex()) ?? [];
      matchIndexes.push(match.getMatchIndex());
      if (!prev.has(match.getCourseIndex())) {
        prev.set(match.getCourseIndex(), matchIndexes);
      }
      return prev;
    }, new Map());

    for (const indexes of matchIndexes.values()) {
      expect(indexes.sort((a, b) => a - b)).toStrictEqual(
        Array.from({ length: indexes.length }, (_, i) => i + 1)
      );
    }
  });

  it('部門をまたいでもコースごとの試合番号が連番になる - すべての部門', async () => {
    const { generateService, preMatchRepository } = createGenerateService([
      ...testTeamData.values(),
    ]);
    expect(await generateService.generateAll()).satisfy(Result.isOk);

    const matchesRes = await preMatchRepository.findAll();
    expect(matchesRes).satisfy(Result.isOk);
    const matches = Result.unwrap(matchesRes);

    const matchIndexes = matches.reduce<Map<number, number[]>>((prev, match) => {
      const matchIndexes = prev.get(match.getCourseIndex()) ?? [];
      matchIndexes.push(match.getMatchIndex());
      if (!prev.has(match.getCourseIndex())) {
        prev.set(match.getCourseIndex(), matchIndexes);
      }
      return prev;
    }, new Map());

    for (const indexes of matchIndexes.values()) {
      expect(indexes.sort((a, b) => a - b)).toStrictEqual(
        Array.from({ length: indexes.length }, (_, i) => i + 1)
      );
    }
  });

  it('どちらかが不足していると全体が失敗する - すべての部門', async () => {
    const testTeams = [...testTeamData.values()].filter(
      (team) => team.getDepartmentType() !== 'elementary'
    );
    const { generateService, preMatchRepository } = createGenerateService(testTeams);

    const generated = await generateService.generateAll();
    expect(Result.isErr(generated)).toBe(true);

    const res = await preMatchRepository.findAll();
    expect(Result.unwrap(res)).toStrictEqual([]);
  });

  it.todo('hotfix: configで指定したコース番号を正しく使う', async () => {
    // const { generateService } = createGenerateService([...testTeamData.values()]);
    // const generatedRes = await generateService.generateByDepartment('open');
    // expect(Result.isOk(generatedRes)).toBe(true);
    // for (const v of Result.unwrap(generatedRes)) {
    //   expect(config.match.pre.course['open']).toContain(v.getCourseIndex());
    // }
  });
});
