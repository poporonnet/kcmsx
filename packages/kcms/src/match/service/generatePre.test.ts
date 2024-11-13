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

    for (let i = 0; i < config.match.pre.course.elementary; i++) {
      const course = res.filter((v) => v.getCourseIndex() === i + 1);
      const pair = course.map((v) => [
        testTeamData.get(v.getTeamId1() ?? ('' as TeamID))?.getTeamName(),
        testTeamData.get(v.getTeamId2() ?? ('' as TeamID))?.getTeamName(),
      ]);
      expect(pair).toStrictEqual(expectedTeamPair[i]);
    }
  });
});
