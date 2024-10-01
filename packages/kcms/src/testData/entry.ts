import { DepartmentType, RobotType } from 'config';
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
  // Openで車輪型は存在しない
  OpenMultiWalk: Team.new({
    id: '3' as TeamID,
    teamName: 'TestTeam3',
    members: ['TestTaro3'],
    robotType: 'leg',
    departmentType: 'open',
  }),
  OpenMultiWalk2: Team.new({
    id: '4' as TeamID,
    teamName: 'TestTeam4',
    members: ['TestTaro4'],
    robotType: 'leg',
    departmentType: 'open',
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
  // 3の重複
  OpenMultiWalkExists: Team.new({
    id: '3' as TeamID,
    teamName: 'TestTeam3',
    members: ['TestTaro3'],
    robotType: 'leg',
    departmentType: 'open',
  }),
  NotEntered: Team.reconstruct({
    id: '6' as TeamID,
    teamName: 'TestTeam6',
    members: ['TestTaro6'],
    robotType: 'leg',
    departmentType: 'elementary',
    isEntered: true,
  }),
  Entered: Team.reconstruct({
    id: '7' as TeamID,
    teamName: 'TestTeam7',
    members: ['TestTaro7'],
    robotType: 'leg',
    departmentType: 'elementary',
    isEntered: true,
  }),
};

type entryBase<I extends string, C extends DepartmentType> = {
  id: I;
  teamName: `TestTeam${I}`;
  members: [`TestTaro${I}`];
  robotType: RobotType;
  departmentType: C;
};

const entryArgsBuilder = <I extends string, C extends DepartmentType>(
  i: I,
  m: RobotType,
  c: C
): entryBase<I, C> => {
  return {
    id: i,
    teamName: `TestTeam${i}`,
    members: [`TestTaro${i}`],
    robotType: m,
    departmentType: c,
  };
};

// TestEntrySet テスト用エントリー用データ, Matchのテスト用に偶数にしてある
// ToDo: Team.newだとエントリーしていない状態で初期化されるので、Team.reconstructを使う
export const TestEntrySet = {
  // 小学生部門 多脚型
  elementaryMultiWalk: {
    101: Team.new(entryArgsBuilder('101' as TeamID, 'leg', 'elementary')),
    102: Team.new(entryArgsBuilder('102' as TeamID, 'leg', 'elementary')),
    103: Team.new(entryArgsBuilder('103' as TeamID, 'leg', 'elementary')),
    104: Team.new(entryArgsBuilder('104' as TeamID, 'leg', 'elementary')),
    105: Team.new(entryArgsBuilder('105' as TeamID, 'leg', 'elementary')),
    106: Team.new(entryArgsBuilder('106' as TeamID, 'leg', 'elementary')),
  },
  // 小学生部門 車輪型
  elementaryWheel: {
    107: Team.new(entryArgsBuilder('107' as TeamID, 'wheel', 'elementary')),
    108: Team.new(entryArgsBuilder('108' as TeamID, 'wheel', 'elementary')),
    109: Team.new(entryArgsBuilder('109' as TeamID, 'wheel', 'elementary')),
    110: Team.new(entryArgsBuilder('110' as TeamID, 'wheel', 'elementary')),
    111: Team.new(entryArgsBuilder('111' as TeamID, 'wheel', 'elementary')),
    112: Team.new(entryArgsBuilder('112' as TeamID, 'wheel', 'elementary')),
  },
  // オープン部門 (多脚型のみ)
  OpenMultiWalk: {
    113: Team.new(entryArgsBuilder('113' as TeamID, 'leg', 'open')),
    114: Team.new(entryArgsBuilder('114' as TeamID, 'leg', 'open')),
    115: Team.new(entryArgsBuilder('115' as TeamID, 'leg', 'open')),
    116: Team.new(entryArgsBuilder('116' as TeamID, 'leg', 'open')),
    117: Team.new(entryArgsBuilder('117' as TeamID, 'leg', 'open')),
    118: Team.new(entryArgsBuilder('118' as TeamID, 'leg', 'open')),
  },
} as const;
