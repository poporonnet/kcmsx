import { Option, Result } from '@mikuroxina/mini-fn';
import { describe, expect, it } from 'vitest';
import { TestEntryData } from '../../testData/entry';
import { DummyRepository } from '../adaptor/repository/dummyRepository';
import { TeamID } from '../models/team';
import { DeleteTeamService } from './delete.js';

describe('DeleteTeamService', () => {
  const repository = new DummyRepository();
  const service = new DeleteTeamService(repository);
  repository.create(TestEntryData['ElementaryMultiWalk']);

  it('正しく削除できる', async () => {
    const actual = await service.handle('1' as TeamID);
    const res = await repository.findByID('1' as TeamID);
    expect(Result.isOk(actual)).toBe(true);
    expect(Option.isNone(res)).toBe(true);
  });
  it('存在しないIDを指定するとエラーを返す', async () => {
    const actual = await service.handle('2' as TeamID);
    expect(Result.isErr(actual)).toBe(true);
  });
});
