import { describe, expect, it } from 'vitest';
import { Team, TeamID } from './team.js';

describe('正しくインスタンスを生成できる', () => {
  it('正しくインスタンスを生成できる', () => {
    const actual = Team.new({
      id: '123' as TeamID,
      teamName: 'チーム1',
      members: ['山田太郎', 'テスト大介'],
      isMultiWalk: false,
      category: 'Open',
    });

    expect(actual.getId()).toBe('123');
    expect(actual.getTeamName()).toBe('チーム1');
    expect(actual.getMembers()).toEqual(['山田太郎', 'テスト大介']);
    expect(actual.getIsMultiWalk()).toBe(false);
    expect(actual.getCategory()).toBe('Open');
  });
});
