import { describe, expect, it } from 'vitest';
import { DummyRepository } from '../adaptor/repository/dummyRepository';
import { Result } from '@mikuroxina/mini-fn';
import { FetchTeamService } from './fetchTeam';

describe('FetchTeamService', () => {
  const repository = new DummyRepository();
  const service = new FetchTeamService(repository);

  const teamData = {
    id: '7549586',
    name: 'かに2',
    entryCode: '2',
    members: ['メンバー3'],
    clubName: 'RubyClub',
    robotType: 'wheel',
    category: 'elementary',
    isEntered: false,
  };

  it('チーム取得ができる', async () => {
    const teamRes = await service.handle('7549586');
    expect(Result.isErr(teamRes)).toBe(false);
    const team = Result.unwrap(teamRes);
    expect(team).toStrictEqual(teamData);
  });

  it('チームがない場合はエラーを返す', async () => {
    const teamRes = await service.handle('0');
    expect(Result.isErr(teamRes)).toBe(false);
  });
});
