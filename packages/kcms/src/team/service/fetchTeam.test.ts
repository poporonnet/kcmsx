import { describe, expect, it } from 'vitest';
import { DummyRepository } from '../adaptor/repository/dummyRepository';
import { Result } from '@mikuroxina/mini-fn';
import { FetchTeamService } from './fetchTeam';
import { Team, TeamID } from '../models/team';

describe('FetchTeamService', () => {
  const teamData = Team.new({
    id: '7549586' as TeamID,
    teamName: 'かに2',
    members: ['メンバー3'],
    robotType: 'wheel',
    departmentType: 'elementary',
  });
  const repository = new DummyRepository([teamData]);
  const service = new FetchTeamService(repository);

  it('チーム取得ができる', async () => {
    const teamRes = await service.handle('7549586' as TeamID);
    expect(Result.isErr(teamRes)).toBe(false);
    const team = Result.unwrap(teamRes);
    expect(team).toStrictEqual(teamData);
  });

  it('チームがない場合はエラーを返す', async () => {
    const teamRes = await service.handle('0' as TeamID);
    expect(Result.isErr(teamRes)).toBe(true);
  });
});
