import { describe, expect, it } from 'vitest';
import { GeneratePreMatchService } from './generatePre';
import { DummyRepository } from '../../team/adaptor/repository/dummyRepository';
import { testTeamData } from '../../testData/entry';
import { FetchTeamService } from '../../team/service/get';
import { SnowflakeIDGenerator } from '../../id/main';
import { DummyPreMatchRepository } from '../adaptor/dummy/preMatchRepository';
import { Result } from '@mikuroxina/mini-fn';
import { TeamID } from '../../team/models/team';
import { config } from 'config';

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
