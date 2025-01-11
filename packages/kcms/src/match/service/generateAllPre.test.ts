import { Result } from '@mikuroxina/mini-fn';
import { config } from 'config';
import { describe, expect, it } from 'vitest';
import { SnowflakeIDGenerator } from '../../id/main';
import { DummyRepository } from '../../team/adaptor/repository/dummyRepository';
import { TeamID } from '../../team/models/team';
import { FetchTeamService } from '../../team/service/fetchTeam';
import { testTeamData } from '../../testData/entry';
import { DummyPreMatchRepository } from '../adaptor/dummy/preMatchRepository';
import { GenerateAllPreMatchService } from './generateAllPre';

describe('GeneratePreMatchService', () => {
  const teamRepository = new DummyRepository([...testTeamData.values()]);
  const fetchService = new FetchTeamService(teamRepository);
  const generator = new SnowflakeIDGenerator(1, () =>
    BigInt(new Date('2024/01/01 00:00:00 UTC').getTime())
  );
  const preMatchRepository = new DummyPreMatchRepository();
  const generateService = new GenerateAllPreMatchService(
    fetchService,
    generator,
    preMatchRepository
  );

  const expectedTeamPair = [
    [
      ['A1', 'B3'],
      ['A4', 'N1'],
      ['B3', 'A1'],
      ['N1', 'A4'],
    ],
    [
      ['A2', 'C1'],
      ['B1', 'N2'],
      ['C1', 'A2'],
      ['N2', 'B1'],
    ],
    [
      ['A3', 'C2'],
      ['B2', undefined],
      [undefined, 'A3'],
      ['C2', 'B2'],
    ],
  ];

  it('正しく予選対戦表を生成できる', async () => {
    const res = await generateService.handle();
    for (const e of res.keys()) {
      const matches = res.get(e);
      if (matches) {
        expect(Result.isOk(matches)).toBe(true);
        for (let i = 0; i < config.match.pre.course[e].length; i++) {
          const course = Result.unwrap(matches).filter((v) => v.getCourseIndex() === i + 1);
          const pair = course.map((v) => [
            testTeamData.get(v.getTeamID1() ?? ('' as TeamID))?.getTeamName(),
            testTeamData.get(v.getTeamID2() ?? ('' as TeamID))?.getTeamName(),
          ]);
          expect(pair).toStrictEqual(expectedTeamPair[i]);
        }
      }
    }
  });
});
