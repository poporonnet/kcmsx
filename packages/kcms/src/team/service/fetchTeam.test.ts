import { Result } from '@mikuroxina/mini-fn';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TestEntryData } from '../../testData/entry.js';
import { DummyRepository } from '../adaptor/repository/dummyRepository.js';
import { TeamID } from '../models/team.js';
import { FetchTeamService } from './fetchTeam.js';

describe('FetchTeamService', () => {
  const repository = new DummyRepository();
  const service = new FetchTeamService(repository);

  const testEntryData = [TestEntryData['ElementaryMultiWalk'], TestEntryData['ElementaryWheel']];

  beforeEach(() => {
    testEntryData.map((d) => repository.create(d));
  });
  afterEach(() => {
    repository.reset();
  });

  it('すべて取得できる', async () => {
    const actual = await service.fetchAll();

    expect(Result.isOk(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(testEntryData);
  });

  it('チーム名で取得できる', async () => {
    const actual = await service.fetchByTeamName(testEntryData[0].getTeamName());
    expect(Result.isOk(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(testEntryData[0]);
  });

  it('チームIDで取得できる', async () => {
    const actual = await service.fetchByID(testEntryData[0].getID());
    expect(Result.isOk(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(testEntryData[0]);
  });

  it('存在しないときはエラーを返す', async () => {
    const actual = await service.fetchByID('0' as TeamID);
    expect(Result.isErr(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(new Error('Not found'));

    const actual2 = await service.fetchByTeamName('team0');
    expect(Result.isErr(actual2)).toBe(true);
    expect(actual2[1]).toStrictEqual(new Error('Not found'));
  });
});
