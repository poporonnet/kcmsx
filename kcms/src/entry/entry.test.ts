import { describe, expect, it } from 'vitest';
import { Entry, EntryID } from './entry.js';

describe('正しくインスタンスを生成できる', () => {
  it('正しくインスタンスを生成できる', () => {
    const actual = Entry.new({
      id: '123' as EntryID,
      teamName: 'チーム1',
      members: ['山田太郎', 'テスト大介'],
      isMultiWalk: false,
      category: 'Open',
    });

    expect(actual.id).toBe('123');
    expect(actual.teamName).toBe('チーム1');
    expect(actual.members).toEqual(['山田太郎', 'テスト大介']);
    expect(actual.isMultiWalk).toBe(false);
    expect(actual.category).toBe('Open');
  });
});
