import { describe, expect, it } from 'vitest';
import { DummyRepository } from '../adaptor/dummyRepository.js';
import { DeleteEntryService } from './delete.js';
import { Option } from '@mikuroxina/mini-fn';
import { Entry } from '../entry.js';

describe('DeleteEntryService', () => {
  const repository = new DummyRepository();
  const service = new DeleteEntryService(repository);
  repository.create(
    Entry.new({
      id: '1',
      teamName: 'TestTeam',
      members: ['TestTaro'],
      isMultiWalk: true,
      category: 'Elementary',
    })
  );

  it('正しく削除できる', async () => {
    const actual = await service.handle('1');
    const res = await repository.findByID('1');

    expect(Option.isNone(actual)).toBe(true);
    expect(Option.isNone(res)).toBe(true);
  });
});
