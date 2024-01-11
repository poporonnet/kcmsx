import { describe, expect, it } from 'vitest';
import { Match } from './match.js';
import { Entry } from '../entry/entry.js';

describe('正しくインスタンスを生成できる', () => {
  const entry1 = Entry.new({
    id: '123',
    teamName: 'team1',
    members: ['member1', 'member2'],
    isMultiWalk: true,
    category: 'Open',
  });

  const entry2 = Entry.new({
    id: '456',
    teamName: 'team2',
    members: ['member3', 'member4'],
    isMultiWalk: true,
    category: 'Open',
  });

  it('試合相手が居るとき', () => {
    const actual = Match.new({
      id: '999',
      teams: { left: entry1, right: entry2 },
      matchType: 'primary',
      courseIndex: 0,
    });

    expect(actual.id).toBe('999');
    expect(actual.teams).toEqual({ left: entry1, right: entry2 });
    expect(actual.results).toBeUndefined();
    expect(actual.matchType).toBe('primary');
    expect(actual.courseIndex).toBe(0);
    expect(actual.time).toBeUndefined();
  });

  it('試合相手が居ないとき', () => {
    const actual = Match.new({
      id: '999',
      teams: { left: entry1, right: undefined },
      matchType: 'primary',
      courseIndex: 0,
    });

    expect(actual.id).toBe('999');
    expect(actual.teams).toEqual({ left: entry1, right: undefined });
    expect(actual.results).toBeUndefined();
    expect(actual.matchType).toBe('primary');
    expect(actual.courseIndex).toBe(0);
    expect(actual.time).toBeUndefined();
  });
});
