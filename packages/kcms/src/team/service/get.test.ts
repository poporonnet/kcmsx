import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DummyRepository } from '../adaptor/repository/dummyRepository';
import { FetchTeamService } from './get.js';
import { Result } from '@mikuroxina/mini-fn';
import { TestEntryData } from '../../testData/entry.js';
import { TeamID } from '../models/team';

describe('getEntryService', () => {
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
    const actual = await service.findAll();

    expect(Result.isOk(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(testEntryData);
  });

  it('チーム名で取得できる', async () => {
    const actual = await service.findByTeamName(testEntryData[0].getTeamName());
    expect(Result.isOk(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(testEntryData[0]);
  });

  it('チームIDで取得できる', async () => {
    const actual = await service.findByID(testEntryData[0].getId());
    expect(Result.isOk(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(testEntryData[0]);
  });

  it('存在しないときはエラーを返す', async () => {
    const actual = await service.findByID('0' as TeamID);
    expect(Result.isErr(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(new Error('Not found'));

    const actual2 = await service.findByTeamName('team0');
    expect(Result.isErr(actual2)).toBe(true);
    expect(actual2[1]).toStrictEqual(new Error('Not found'));
  });
});
