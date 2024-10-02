import { describe, expect, it } from 'vitest';
import { Team, TeamID } from './team.js';

describe('正しくインスタンスを生成できる', () => {
  it('正しくインスタンスを生成できる', () => {
    const actual = Team.reconstruct({
      id: '123' as TeamID,
      teamName: 'チーム1',
      members: ['山田太郎', 'テスト大介'],
      departmentType: 'open',
      robotType: 'leg',
      isEntered: true,
    });

    expect(actual.getId()).toBe('123');
    expect(actual.getTeamName()).toBe('チーム1');
    expect(actual.getMembers()).toEqual(['山田太郎', 'テスト大介']);
    expect(actual.getRobotType()).toBe('leg');
    expect(actual.getDepartmentType()).toBe('open');
  });

  it('正しくインスタンスを生成できる - クラブを含む場合', () => {
    const actual = Team.reconstruct({
      id: '123' as TeamID,
      teamName: 'チーム1',
      members: ['山田太郎', 'テスト大介'],
      departmentType: 'open',
      robotType: 'leg',
      isEntered: true,
      clubName: 'テストクラブ',
    });

    expect(actual.getId()).toBe('123');
    expect(actual.getTeamName()).toBe('チーム1');
    expect(actual.getMembers()).toEqual(['山田太郎', 'テスト大介']);
    expect(actual.getRobotType()).toBe('leg');
    expect(actual.getDepartmentType()).toBe('open');
    expect(actual.getClubName()).toBe('テストクラブ');
  });

  it('エントリーできる', () => {
    const team = Team.new({
      id: '1' as TeamID,
      teamName: 'team1',
      members: ['山田太郎', 'テスト大介'],
      departmentType: 'open',
      robotType: 'leg',
    });

    team.enter();

    expect(team.getIsEntered()).toBe(true);
  });

  it('エントリー解除できる', () => {
    const team = Team.new({
      id: '1' as TeamID,
      teamName: 'team1',
      members: ['山田太郎', 'テスト大介'],
      departmentType: 'open',
      robotType: 'leg',
    });

    team.enter();
    team.cancelEntry();

    expect(team.getIsEntered()).toBe(false);
  });
});
