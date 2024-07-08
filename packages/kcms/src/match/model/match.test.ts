import { describe, expect, it } from 'vitest';
import { MatchID, Match } from './match.js';
import { TestEntryData } from '../../testData/entry.js';

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

    expect(actual.getId()).toBe('999');
    expect(actual.getTeams()).toEqual({
      left: TestEntryData['ElementaryMultiWalk'],
      right: TestEntryData['ElementaryWheel'],
    });
    expect(actual.getResults()).toBeUndefined();
    expect(actual.getMatchType()).toBe('primary');
    expect(actual.getCourseIndex()).toBe(0);
    expect(actual.getTime()).toBeUndefined();
    expect(actual.isEnd()).toBe(false);
  });

  it('試合相手が居ないとき', () => {
    const actual = Match.new({
      id: '999' as MatchID,
      teams: { left: TestEntryData['ElementaryMultiWalk'], right: undefined },
      matchType: 'primary',
      courseIndex: 0,
    });

    expect(actual.getId()).toBe('999');
    expect(actual.getTeams()).toEqual({
      left: TestEntryData['ElementaryMultiWalk'],
      right: undefined,
    });
    expect(actual.getResults()).toBeUndefined();
    expect(actual.getMatchType()).toBe('primary');
    expect(actual.getCourseIndex()).toBe(0);
    expect(actual.getTime()).toBeUndefined();
  });
});
