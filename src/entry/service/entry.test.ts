import { afterEach, describe, expect, it } from 'vitest';
import { DummyRepository } from '../adaptor/dummyRepository.js';
import { Entry } from '../entry.js';
import { Result } from '@mikuroxina/mini-fn';
import { EntryService } from './entry.js';

describe('entryService', () => {
  const repository = new DummyRepository();
  const service = new EntryService(repository);

  afterEach(() => {
    repository.reset();
  });

  it('エントリーできる', async () => {
    const entry = Entry.new({
      id: '123',
      teamName: 'team1',
      members: ['山田四十郎'],
      isMultiWalk: true,
      category: 'Open',
    });
    const actual = await service.create(entry);

    expect(Result.isOk(actual)).toBe(true);
    if (Result.isErr(actual)) {
      return;
    }

    expect(actual[1].members).toStrictEqual(['山田四十郎']);
    expect(actual[1].teamName).toBe('team1');
    expect(actual[1].isMultiWalk).toBe(true);
    expect(actual[1].category).toBe('Open');
  });

  it('チーム名が重複するときはエラー終了する', async () => {
    const entry1 = Entry.new({
      id: '123',
      teamName: 'team1',
      members: ['山田四十郎'],
      isMultiWalk: true,
      category: 'Open',
    });
    const entry2 = Entry.new({
      id: '123',
      teamName: 'team1',
      members: ['山田四十郎'],
      isMultiWalk: true,
      category: 'Open',
    });
    await service.create(entry1);
    const result = await service.create(entry2);

    expect(Result.isErr(result)).toBe(true);
    expect(result[1]).toStrictEqual(new Error('teamName Exists'));
  });

  it('オープン部門のメンバーは1人のみ', async () => {
    const entry = Entry.new({
      id: '123',
      teamName: 'team1',
      members: ['山田四十郎', '山田太郎'],
      isMultiWalk: true,
      category: 'Open',
    });
    const actual = await service.create(entry);

    expect(Result.isErr(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(new Error('too many members'));
  });

  it('小学生部門のメンバーは1または2人', async () => {
    const entry = Entry.new({
      id: '123',
      teamName: 'team1',
      members: ['山田四十郎', '山田太郎', '山田次郎'],
      isMultiWalk: true,
      category: 'Elementary',
    });
    const actual = await service.create(entry);

    expect(Result.isErr(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(new Error('too many members'));
  });

  it('メンバーが居ないチームは作れない', async () => {
    const entry = Entry.new({
      id: '123',
      teamName: 'team1',
      members: [],
      isMultiWalk: true,
      category: 'Elementary',
    });
    const actual = await service.create(entry);

    expect(Result.isErr(actual)).toBe(true);
    expect(actual[1]).toStrictEqual(new Error('no member'));
  });
});
