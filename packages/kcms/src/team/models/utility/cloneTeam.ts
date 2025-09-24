import { Team } from '../team';

export const cloneTeam = (from: Team): Team => {
  return Team.reconstruct({
    id: from.getID(),
    teamName: from.getTeamName(),
    members: [...from.getMembers()],
    departmentType: from.getDepartmentType(),
    robotType: from.getRobotType(),
    isEntered: from.getIsEntered(),
    clubName: from.getClubName(),
    entryCode: from.getEntryCode(),
  });
};
