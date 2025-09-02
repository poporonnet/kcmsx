import { PreMatch } from '../model/pre';
import { cloneRunResult } from './cloneRunResult';

export const clonePreMatch = (from: PreMatch): PreMatch => {
  return PreMatch.reconstruct({
    id: from.getID(),
    courseIndex: from.getCourseIndex(),
    matchIndex: from.getMatchIndex(),
    teamID1: from.getTeamID1(),
    teamID2: from.getTeamID2(),
    runResults: from.getRunResults().map(cloneRunResult),
    departmentType: from.getDepartmentType(),
  });
};
