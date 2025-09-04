import { describe, expect, it } from 'vitest';
import { TeamID } from '../../team/models/team';
import { RunResult, RunResultID } from '../model/runResult';
import { cloneRunResult } from './cloneRunResult';

describe('cloneRunResult', () => {
  const from = RunResult.reconstruct({
    id: '123' as RunResultID,
    teamID: '456' as TeamID,
    points: 5,
    goalTimeSeconds: 30,
    finishState: 'GOAL',
  });

  it('正しくインスタンスを複製できる - 値が等しい', () => {
    const cloned = cloneRunResult(from);

    expect(from).toStrictEqual(cloned);
  });

  it('正しくインスタンスを複製できる - 参照が異なる', () => {
    const cloned = cloneRunResult(from);

    expect(from).not.toBe(cloned);
  });
});
