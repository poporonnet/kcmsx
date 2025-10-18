import { config, DepartmentType } from 'config';
import { Team, TeamID } from '../team/models/team.js';

export const TestEntryData = {
  ElementaryMultiWalk: Team.new({
    id: '1' as TeamID,
    teamName: 'TestTeam1',
    members: ['TestTaro1'],
    robotType: 'leg',
    departmentType: 'elementary',
  }),
  ElementaryWheel: Team.new({
    id: '2' as TeamID,
    teamName: 'TestTeam2',
    members: ['TestTaro2'],
    robotType: 'wheel',
    departmentType: 'elementary',
  }),
  // 1の重複
  ElementaryMultiWalkExists: Team.new({
    id: '1' as TeamID,
    teamName: 'TestTeam1',
    members: ['TestTaro1'],
    robotType: 'leg',
    departmentType: 'elementary',
  }),
  // 2の重複
  ElementaryWheelExists: Team.new({
    id: '2' as TeamID,
    teamName: 'TestTeam2',
    members: ['TestTaro2'],
    robotType: 'wheel',
    departmentType: 'elementary',
  }),
  NotEntered: () =>
    Team.reconstruct({
      id: '6' as TeamID,
      teamName: 'TestTeam6',
      members: ['TestTaro6'],
      robotType: config.robotTypes[0],
      departmentType: config.departmentTypes[0],
      isEntered: false,
    }),
  Entered: () =>
    Team.reconstruct({
      id: '7' as TeamID,
      teamName: 'TestTeam7',
      members: ['TestTaro7'],
      robotType: config.robotTypes[0],
      departmentType: config.departmentTypes[0],
      isEntered: true,
    }),
};

const testDataGenerator = (args: {
  clubName?: string;
  teamName: string;
  department: DepartmentType;
  isEntered: boolean;
}) => {
  return Team.reconstruct({
    id: Math.random().toString() as TeamID,
    teamName: `${args.clubName ?? 'N'}${args.teamName}`,
    members: [`TestTaro ${Math.random()}`],
    robotType: 'leg',
    departmentType: args.department,
    clubName: args.clubName,
    isEntered: args.isEntered,
  });
};

/*
 * TestEntrySet テスト用エントリー用データ, Matchのテスト用
 */
export const testTeamData: Map<TeamID, Team> = new Map<TeamID, Team>(
  [
    testDataGenerator({ clubName: 'A', teamName: '1', department: 'elementary', isEntered: true }),
    testDataGenerator({ clubName: 'A', teamName: '2', department: 'elementary', isEntered: true }),
    testDataGenerator({ clubName: 'A', teamName: '3', department: 'elementary', isEntered: true }),
    testDataGenerator({ clubName: 'A', teamName: '4', department: 'elementary', isEntered: true }),
    testDataGenerator({ clubName: 'B', teamName: '1', department: 'elementary', isEntered: true }),
    testDataGenerator({ clubName: 'B', teamName: '2', department: 'elementary', isEntered: true }),
    testDataGenerator({ clubName: 'B', teamName: '3', department: 'elementary', isEntered: true }),
    testDataGenerator({ clubName: 'C', teamName: '1', department: 'elementary', isEntered: true }),
    testDataGenerator({ clubName: 'C', teamName: '2', department: 'elementary', isEntered: true }),
    testDataGenerator({ teamName: '1', department: 'elementary', isEntered: true }), // N1
    testDataGenerator({ teamName: '2', department: 'elementary', isEntered: true }), // N2
    testDataGenerator({ clubName: 'A', teamName: '1', department: 'open', isEntered: true }),
    testDataGenerator({ clubName: 'A', teamName: '2', department: 'open', isEntered: true }),
    testDataGenerator({ clubName: 'A', teamName: '3', department: 'open', isEntered: true }),
    testDataGenerator({ clubName: 'A', teamName: '4', department: 'open', isEntered: true }),
    testDataGenerator({ clubName: 'B', teamName: '1', department: 'open', isEntered: true }),
    testDataGenerator({ clubName: 'B', teamName: '2', department: 'open', isEntered: true }),
    testDataGenerator({ clubName: 'B', teamName: '3', department: 'open', isEntered: true }),
    testDataGenerator({ clubName: 'C', teamName: '1', department: 'open', isEntered: true }),
    testDataGenerator({ clubName: 'C', teamName: '2', department: 'open', isEntered: true }),
    testDataGenerator({ teamName: '1', department: 'open', isEntered: true }), // N1
    testDataGenerator({ teamName: '2', department: 'open', isEntered: true }), // N2
  ].map((v) => [v.getID(), v])
);
