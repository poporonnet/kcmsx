import { Result } from '@mikuroxina/mini-fn';
import { config } from 'config';
import { describe, expect, it } from 'vitest';
import { SnowflakeIDGenerator } from '../../id/main';
import { DummyRepository } from '../../team/adaptor/repository/dummyRepository';
import { TeamID } from '../../team/models/team';
import { FetchTeamService } from '../../team/service/fetchTeam';
import { testTeamData } from '../../testData/entry';
import { DummyPreMatchRepository } from '../adaptor/dummy/preMatchRepository';
import { GeneratePreMatchService } from './generatePre';

describe('GeneratePreMatchService', () => {
  const teamRepository = new DummyRepository([...testTeamData.values()]);
  const fetchService = new FetchTeamService(teamRepository);
  const generator = new SnowflakeIDGenerator(1, () =>
    BigInt(new Date('2024/01/01 00:00:00 UTC').getTime())
  );
  const preMatchRepository = new DummyPreMatchRepository();
  const generateService = new GeneratePreMatchService(fetchService, generator, preMatchRepository);

  const expectedTeamPair = [
    [
      ['A1', 'B2'],
      ['A2', 'B3'],
      ['A3', 'C1'],
      ['A4', 'C2'],
      ['B1', 'N1'],
      ['B2', 'N2'],
      ['B3', 'A1'],
      ['C1', 'A2'],
      ['C2', 'A3'],
      ['N1', 'A4'],
      ['N2', 'B1'],
    ],
  ];

  it('正しく予選対戦表を生成できる', async () => {
    const generated = await generateService.handle('elementary');
    expect(Result.isOk(generated)).toBe(true);
    const res = Result.unwrap(generated);

    for (let i = 0; i < config.match.pre.course.elementary.length; i++) {
      const course = res.filter((v) => v.getCourseIndex() === i + 1);
      const pair = course.map((v) => [
        testTeamData.get(v.getTeamID1() ?? ('' as TeamID))?.getTeamName(),
        testTeamData.get(v.getTeamID2() ?? ('' as TeamID))?.getTeamName(),
      ]);
      expect(pair).toStrictEqual(expectedTeamPair[i]);
    }
  });

  it('hotfix: configで指定したコース番号を正しく使う', async () => {
    const generatedRes = await generateService.handle(`elementary`);

    expect(Result.isOk(generatedRes)).toBe(true);
    for (const v of Result.unwrap(generatedRes)) {
      expect(config.match.pre.course[`elementary`]).toContain(v.getCourseIndex());
    }
  });

  it('hotfix: 部門をまたいでもコースごとの試合番号が連番になる', async () => {
    expect(await generateService.handle('elementary')).satisfy(Result.isOk);
    //expect(await generateService.handle('open')).satisfy(Result.isOk);

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
});
