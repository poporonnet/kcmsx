import { config } from 'config';
import { describe, expect, it } from 'vitest';
import { Team, TeamID } from '../team';
import { cloneTeam } from './cloneTeam';

describe('cloneTeam', () => {
  it('正しくインスタンスを複製できる - 値が等しい', () => {
    const from = Team.reconstruct({
      id: '123' as TeamID,
      teamName: 'チーム1',
      members: ['山田太郎', 'テスト大介'],
      departmentType: config.departmentTypes[0],
      robotType: config.robotTypes[0],
      isEntered: true,
    });
    const cloned = cloneTeam(from);

    expect(from).toStrictEqual(cloned);
  });

  it('正しくインスタンスを複製できる - 参照が異なる', () => {
    const from = Team.reconstruct({
      id: '123' as TeamID,
      teamName: 'チーム1',
      members: ['山田太郎', 'テスト大介'],
      departmentType: config.departmentTypes[0],
      robotType: config.robotTypes[0],
      isEntered: true,
    });
    const cloned = cloneTeam(from);

    expect(from).not.toBe(cloned);
    expect(from.getMembers()).not.toBe(cloned.getMembers());
  });
});
