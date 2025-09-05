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
    const generated = await generateService.generateByDepartment('elementary');
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

  it('正しく予選対戦表を生成できる - すべての部門', async () => {
    const generated = await generateService.generateAll();
    expect(Result.isOk(generated)).toBe(true);
    const res = Result.unwrap(generated);

    for (const d of res.keys()) {
      const matches = res.get(d);
      for (let i = 0; i < config.match.pre.course[d].length; i++) {
        const course = matches!.filter((v) => v.getCourseIndex() === i + 1);
        const pair = course.map((v) => [
          testTeamData.get(v.getTeamID1() ?? ('' as TeamID))?.getTeamName(),
          testTeamData.get(v.getTeamID2() ?? ('' as TeamID))?.getTeamName(),
        ]);
        expect(pair).toStrictEqual(expectedTeamPair[i]);
      }
    }
  });
});
