import { afterEach, describe, expect, it } from 'vitest';
import { DummyRepository } from '../adaptor/repository/dummyRepository';
import { Team, TeamID } from '../models/team.js';
import { Result } from '@mikuroxina/mini-fn';
import { CreateTeamService } from './createTeam';
import { TestEntryData } from '../../testData/entry.js';
import { SnowflakeIDGenerator } from '../../id/main.js';

describe('CreateTeamService', () => {
  const repository = new DummyRepository();
  const service = new CreateTeamService(
    repository,
    new SnowflakeIDGenerator(1, () => BigInt(new Date().getTime()))
  );

  afterEach(() => {
    repository.reset();
  });

  it('参加登録できる', async () => {
    const data = TestEntryData['ElementaryMultiWalk'];
    const teamRes = await service.create([
      {
        teamName: data.getTeamName(),
        members: data.getMembers(),
        departmentType: data.getDepartmentType(),
        robotType: 'leg',
      },
    ]);

    expect(Result.isOk(teamRes)).toBe(true);
    if (Result.isErr(teamRes)) {
      return;
    }
    const teams = Result.unwrap(teamRes);

    expect(teams[0].getMembers()).toStrictEqual(['TestTaro1']);
    expect(teams[0].getTeamName()).toBe('TestTeam1');
    expect(teams[0].getRobotType()).toBe('leg');
    expect(teams[0].getDepartmentType()).toBe('elementary');
  });

  it('チーム名が重複するときはエラー終了する', async () => {
    const data = TestEntryData['ElementaryMultiWalk'];
    const existsData = TestEntryData['ElementaryMultiWalkExists'];
    await service.create([
      {
        teamName: data.getTeamName(),
        members: data.getMembers(),
        departmentType: data.getDepartmentType(),
        robotType: 'leg',
      },
    ]);
    const result = await service.create([
      {
        teamName: existsData.getTeamName(),
        members: existsData.getMembers(),
        departmentType: existsData.getDepartmentType(),
        robotType: 'leg',
      },
    ]);

    expect(Result.isErr(result)).toBe(true);
    expect(result[1]).toStrictEqual(new Error('teamName Exists'));
  });

  it('メンバーが居ないチームは作れない', async () => {
    const team = Team.new({
      id: '123' as TeamID,
      teamName: 'team1',
      members: [],
      departmentType: 'elementary',
      robotType: 'leg',
    });
    const actual = await service.create([
      {
        teamName: team.getTeamName(),
        members: team.getMembers(),
        departmentType: team.getDepartmentType(),
        robotType: team.getRobotType(),
      },
    ]);

    expect(Result.isErr(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(new Error('no member'));
  });

  it('メンバーが3人以上のチームは作れない', async () => {
    const team = Team.new({
      id: '123' as TeamID,
      teamName: 'team1',
      members: ['A太郎', 'B太郎', 'C太郎'],
      departmentType: 'elementary',
      robotType: 'leg',
    });
    const actual = await service.create([
      {
        teamName: team.getTeamName(),
        members: team.getMembers(),
        departmentType: team.getDepartmentType(),
        robotType: team.getRobotType(),
      },
    ]);

    expect(Result.isErr(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(new Error('too many members'));
  });
});
