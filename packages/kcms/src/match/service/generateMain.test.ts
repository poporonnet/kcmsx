import { Result } from '@mikuroxina/mini-fn';
import { describe, expect, it } from 'vitest';
import { SnowflakeIDGenerator } from '../../id/main';
import { TeamID } from '../../team/models/team';
import { DummyMainMatchRepository } from '../adaptor/dummy/mainMatchRepository';
import { GenerateMainMatchService } from './generateMain';

describe('GenerateMainMatchService', () => {
  const idGenerator = new SnowflakeIDGenerator(1, () =>
    BigInt(new Date('2024/01/01 00:00:00 UTC').getTime())
  );
  const mainMatchRepository = new DummyMainMatchRepository([]);
  const service = new GenerateMainMatchService(mainMatchRepository, idGenerator);

  it('本戦試合を生成できる', async () => {
    const res = await service.handle('1' as TeamID, '2' as TeamID);
    expect(Result.isOk(res)).toBe(true);

    const match = Result.unwrap(res);
    expect(match.getTeamId1()).toBe('1');
    expect(match.getTeamId2()).toBe('2');
  });

  it('(安来用) 本戦試合の試合番号は1-1になる', async () => {
    const res = await service.handle('1' as TeamID, '2' as TeamID);
    expect(Result.isOk(res)).toBe(true);

    const match = Result.unwrap(res);
    expect(match.getMatchIndex()).toBe(1);
    expect(match.getCourseIndex()).toBe(1);
  });
});
