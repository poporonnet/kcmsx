import { describe, expect, it } from 'vitest';
import { DummyRepository } from '../adaptor/repository/dummyRepository';
import { DeleteTeamService } from './delete.js';
import { Option } from '@mikuroxina/mini-fn';
import { TestEntryData } from '../../testData/entry.js';

describe('DeleteTeamService', () => {
  const repository = new DummyRepository();
  const service = new DeleteTeamService(repository);
  repository.create(TestEntryData['ElementaryMultiWalk']);

  it('正しく削除できる', async () => {
    const actual = await service.handle('1');
    const res = await repository.findByID('1');

    expect(Option.isNone(actual)).toBe(true);
    expect(Option.isNone(res)).toBe(true);
  });
});
