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
      isMultiWalk: data.getIsMultiWalk(),
      category: data.getCategory(),
      departmentType: data.getDepartmentType(),
    });

    expect(Result.isOk(actual)).toBe(true);
    if (Result.isErr(actual)) {
      return;
    }

    expect(actual[1].getMembers()).toStrictEqual(['TestTaro1']);
    expect(actual[1].getTeamName()).toBe('TestTeam1');
    expect(actual[1].getIsMultiWalk()).toBe(true);
    expect(actual[1].getCategory()).toBe('Elementary');
  });

  it('チーム名が重複するときはエラー終了する', async () => {
    const data = TestEntryData['ElementaryMultiWalk'];
    const existsData = TestEntryData['ElementaryMultiWalkExists'];
    await service.create({
      teamName: data.getTeamName(),
      members: data.getMembers(),
      isMultiWalk: data.getIsMultiWalk(),
      category: data.getCategory(),
      departmentType: data.getDepartmentType(),
    });
    const result = await service.create({
      teamName: existsData.getTeamName(),
      members: existsData.getMembers(),
      isMultiWalk: existsData.getIsMultiWalk(),
      category: existsData.getCategory(),
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
      isMultiWalk: true,
      category: 'Elementary',
      departmentType: 'elementary',
    });
    const actual = await service.create({
      teamName: team.getTeamName(),
      members: team.getMembers(),
      isMultiWalk: team.getIsMultiWalk(),
      category: team.getCategory(),
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
      isMultiWalk: true,
      category: 'Elementary',
      departmentType: 'elementary',
    });
    const actual = await service.create({
      teamName: team.getTeamName(),
      members: team.getMembers(),
      isMultiWalk: team.getIsMultiWalk(),
      category: team.getCategory(),
      departmentType: team.getDepartmentType(),
    });

    expect(Result.isErr(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(new Error('too many members'));
  });
});
