import { RunResult } from '../model/runResult';

export const cloneRunResult = (from: RunResult): RunResult => {
  return RunResult.reconstruct({
    id: from.getID(),
    teamID: from.getTeamID(),
    points: from.getPoints(),
    goalTimeSeconds: from.getGoalTimeSeconds(),
    finishState: from.isFinished() ? 'FINISHED' : 'GOAL',
  });
};
