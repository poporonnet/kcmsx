import { afterEach, describe, expect, it } from 'vitest';
import { DummyRepository } from '../adaptor/dummyRepository.js';
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
    const actual = await service.create({
      teamName: data.getTeamName(),
      members: data.getMembers(),
      robotType: data.getRobotType(),
      departmentType: data.getDepartmentType(),
    });

    expect(Result.isOk(actual)).toBe(true);
    if (Result.isErr(actual)) {
      return;
    }

    expect(actual[1].getMembers()).toStrictEqual(['TestTaro1']);
    expect(actual[1].getTeamName()).toBe('TestTeam1');
    expect(actual[1].getRobotType()).toBe('leg');
    expect(actual[1].getDepartmentType()).toBe('elementary');
  });

  it('チーム名が重複するときはエラー終了する', async () => {
    const data = TestEntryData['ElementaryMultiWalk'];
    const existsData = TestEntryData['ElementaryMultiWalkExists'];
    await service.create({
      teamName: data.getTeamName(),
      members: data.getMembers(),
      robotType: data.getRobotType(),
      departmentType: data.getDepartmentType(),
    });
    const result = await service.create({
      teamName: existsData.getTeamName(),
      members: existsData.getMembers(),
      robotType: existsData.getRobotType(),
      departmentType: existsData.getDepartmentType(),
    });

    expect(Result.isErr(result)).toBe(true);
    expect(result[1]).toStrictEqual(new Error('teamName Exists'));
  });

  it('メンバーが居ないチームは作れない', async () => {
    const team = Team.new({
      id: '123' as TeamID,
      teamName: 'team1',
      members: [],
      robotType: 'leg',
      departmentType: 'elementary',
    });
    const actual = await service.create({
      teamName: team.getTeamName(),
      members: team.getMembers(),
      robotType: team.getRobotType(),
      departmentType: team.getDepartmentType(),
    });

    expect(Result.isErr(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(new Error('no member'));
  });

  it('メンバーが3人以上のチームは作れない', async () => {
    const team = Team.new({
      id: '123' as TeamID,
      teamName: 'team1',
      members: ['A太郎', 'B太郎', 'C太郎'],
      robotType: 'leg',
      departmentType: 'elementary',
    });
    const actual = await service.create({
      teamName: team.getTeamName(),
      members: team.getMembers(),
      robotType: team.getRobotType(),
      departmentType: team.getDepartmentType(),
    });

    expect(Result.isErr(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(new Error('too many members'));
  });
});
