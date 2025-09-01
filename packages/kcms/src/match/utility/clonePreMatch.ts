import { PreMatch } from '../model/pre';
import { cloneRunResult } from './cloneRunResult';

export const clonePreMatch = (from: PreMatch): PreMatch => {
  const clonedRunResults = from.getRunResults().map((e) => {
    return cloneRunResult(e);
  });

  return PreMatch.new({
    id: from.getID(),
    courseIndex: from.getCourseIndex(),
    matchIndex: from.getMatchIndex(),
    teamID1: from.getTeamID1(),
    teamID2: from.getTeamID2(),
    runResults: clonedRunResults,
    departmentType: from.getDepartmentType(),
  });
};
