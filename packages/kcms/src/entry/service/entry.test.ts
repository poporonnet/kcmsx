import { afterEach, describe, expect, it } from 'vitest';
import { DummyRepository } from '../adaptor/dummyRepository.js';
import { Entry, EntryID } from '../entry.js';
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
    const actual = await service.create(TestEntryData['ElementaryMultiWalk']);

    expect(Result.isOk(actual)).toBe(true);
    if (Result.isErr(actual)) {
      return;
    }

    expect(actual[1].members).toStrictEqual(['TestTaro1']);
    expect(actual[1].teamName).toBe('TestTeam1');
    expect(actual[1].isMultiWalk).toBe(true);
    expect(actual[1].category).toBe('Elementary');
  });

  it('チーム名が重複するときはエラー終了する', async () => {
    await service.create(TestEntryData['ElementaryMultiWalk']);
    const result = await service.create(TestEntryData['ElementaryMultiWalkExists']);

    expect(Result.isErr(result)).toBe(true);
    expect(result[1]).toStrictEqual(new Error('teamName Exists'));
  });

  it('オープン部門のメンバーは1人のみ', async () => {
    const entry = Entry.new({
      id: '123' as EntryID,
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
      id: '123' as EntryID,
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
      id: '123' as EntryID,
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
