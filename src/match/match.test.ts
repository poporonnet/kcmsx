import { describe, expect, it } from 'vitest';
import { MatchID, Match } from './match.js';
import { TestEntryData } from '../testData/entry.js';

describe('正しくインスタンスを生成できる', () => {
  it('試合相手が居るとき', () => {
    const actual = Match.new({
      id: '999' as MatchID,
      teams: {
        left: TestEntryData['ElementaryMultiWalk'],
        right: TestEntryData['ElementaryWheel'],
      },
      matchType: 'primary',
      courseIndex: 0,
    });

    expect(actual.id).toBe('999');
    expect(actual.teams).toEqual({
      left: TestEntryData['ElementaryMultiWalk'],
      right: TestEntryData['ElementaryWheel'],
    });
    expect(actual.results).toBeUndefined();
    expect(actual.matchType).toBe('primary');
    expect(actual.courseIndex).toBe(0);
    expect(actual.time).toBeUndefined();
    expect(actual.isEnd()).toBe(false);
  });

  it('試合相手が居ないとき', () => {
    const actual = Match.new({
      id: '999' as MatchID,
      teams: { left: TestEntryData['ElementaryMultiWalk'], right: undefined },
      matchType: 'primary',
      courseIndex: 0,
    });

    expect(actual.id).toBe('999');
    expect(actual.teams).toEqual({ left: TestEntryData['ElementaryMultiWalk'], right: undefined });
    expect(actual.results).toBeUndefined();
    expect(actual.matchType).toBe('primary');
    expect(actual.courseIndex).toBe(0);
    expect(actual.time).toBeUndefined();
  });
});
