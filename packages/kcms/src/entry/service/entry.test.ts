import { afterEach, describe, expect, it } from 'vitest';
import { DummyRepository } from '../adaptor/dummyRepository.js';
import { Team, TeamID } from '../models/team.js';
import { Result } from '@mikuroxina/mini-fn';
import { EntryService } from './entry.js';
import { TestEntryData } from '../../testData/entry.js';
import { SnowflakeIDGenerator } from '../../id/main.js';

describe('entryService', () => {
  const repository = new DummyRepository();
  const service = new EntryService(
    repository,
    new SnowflakeIDGenerator(1, () => BigInt(new Date().getTime()))
  );

  afterEach(() => {
    repository.reset();
  });

  it('エントリーできる', async () => {
    const data = TestEntryData['ElementaryMultiWalk'];
    const actual = await service.create({
      teamName: data.getTeamName(),
      members: data.getMembers(),
      isMultiWalk: data.getIsMultiWalk(),
      category: data.getCategory(),
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
    });
    const result = await service.create({
      teamName: existsData.getTeamName(),
      members: existsData.getMembers(),
      isMultiWalk: existsData.getIsMultiWalk(),
      category: existsData.getCategory(),
    });

    expect(Result.isErr(result)).toBe(true);
    expect(result[1]).toStrictEqual(new Error('teamName Exists'));
  });

  it('オープン部門のメンバーは1人のみ', async () => {
    const entry = Team.new({
      id: '123' as TeamID,
      teamName: 'team1',
      members: ['山田四十郎', '山田太郎'],
      isMultiWalk: true,
      category: 'Open',
    });
    const actual = await service.create({
      teamName: entry.getTeamName(),
      members: entry.getMembers(),
      isMultiWalk: entry.getIsMultiWalk(),
      category: entry.getCategory(),
    });

    expect(Result.isErr(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(new Error('too many members'));
  });

  it('小学生部門のメンバーは1または2人', async () => {
    const entry = Team.new({
      id: '123' as TeamID,
      teamName: 'team1',
      members: ['山田四十郎', '山田太郎', '山田次郎'],
      isMultiWalk: true,
      category: 'Elementary',
    });
    const actual = await service.create({
      teamName: entry.getTeamName(),
      members: entry.getMembers(),
      isMultiWalk: entry.getIsMultiWalk(),
      category: entry.getCategory(),
    });

    expect(Result.isErr(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(new Error('too many members'));
  });

  it('メンバーが居ないチームは作れない', async () => {
    const entry = Team.new({
      id: '123' as TeamID,
      teamName: 'team1',
      members: [],
      isMultiWalk: true,
      category: 'Elementary',
    });
    const actual = await service.create({
      teamName: entry.getTeamName(),
      members: entry.getMembers(),
      isMultiWalk: entry.getIsMultiWalk(),
      category: entry.getCategory(),
    });

    expect(Result.isErr(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(new Error('no member'));
  });
});
