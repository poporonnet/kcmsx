import { Team, TeamID } from '../team/models/team.js';

export const TestEntryData = {
  ElementaryMultiWalk: Team.new({
    id: '1' as TeamID,
    teamName: 'TestTeam1',
    members: ['TestTaro1'],
    isMultiWalk: true,
    category: 'Elementary',
  }),
  ElementaryWheel: Team.new({
    id: '2' as TeamID,
    teamName: 'TestTeam2',
    members: ['TestTaro2'],
    isMultiWalk: false,
    category: 'Elementary',
  }),
  // Openで車輪型は存在しない
  OpenMultiWalk: Team.new({
    id: '3' as TeamID,
    teamName: 'TestTeam3',
    members: ['TestTaro3'],
    isMultiWalk: true,
    category: 'Open',
  }),
  OpenMultiWalk2: Team.new({
    id: '4' as TeamID,
    teamName: 'TestTeam4',
    members: ['TestTaro4'],
    isMultiWalk: true,
    category: 'Open',
  }),
  // 1の重複
  ElementaryMultiWalkExists: Team.new({
    id: '1' as TeamID,
    teamName: 'TestTeam1',
    members: ['TestTaro1'],
    isMultiWalk: true,
    category: 'Elementary',
  }),
  // 2の重複
  ElementaryWheelExists: Team.new({
    id: '2' as TeamID,
    teamName: 'TestTeam2',
    members: ['TestTaro2'],
    isMultiWalk: false,
    category: 'Elementary',
  }),
  // 3の重複
  OpenMultiWalkExists: Team.new({
    id: '3' as TeamID,
    teamName: 'TestTeam3',
    members: ['TestTaro3'],
    isMultiWalk: true,
    category: 'Open',
  }),
};

type entryBase<I extends string, M extends boolean, C extends 'Elementary' | 'Open'> = {
  id: I;
  teamName: `TestTeam${I}`;
  members: [`TestTaro${I}`];
  isMultiWalk: M;
  category: C;
};

const entryArgsBuilder = <I extends string, M extends boolean, C extends 'Elementary' | 'Open'>(
  i: I,
  m: M,
  c: C
): entryBase<I, M, C> => {
  return {
    id: i,
    teamName: `TestTeam${i}`,
    members: [`TestTaro${i}`],
    isMultiWalk: m,
    category: c,
  };
};

// TestEntrySet テスト用エントリー用データ, Matchのテスト用に偶数にしてある
// ToDo: Team.newだとエントリーしていない状態で初期化されるので、Team.reconstructを使う
export const TestEntrySet = {
  // 小学生部門 多脚型
  ElementaryMultiWalk: {
    101: Team.new(entryArgsBuilder('101' as TeamID, true, 'Elementary')),
    102: Team.new(entryArgsBuilder('102' as TeamID, true, 'Elementary')),
    103: Team.new(entryArgsBuilder('103' as TeamID, true, 'Elementary')),
    104: Team.new(entryArgsBuilder('104' as TeamID, true, 'Elementary')),
    105: Team.new(entryArgsBuilder('105' as TeamID, true, 'Elementary')),
    106: Team.new(entryArgsBuilder('106' as TeamID, true, 'Elementary')),
  },
  // 小学生部門 車輪型
  ElementaryWheel: {
    107: Team.new(entryArgsBuilder('107' as TeamID, false, 'Elementary')),
    108: Team.new(entryArgsBuilder('108' as TeamID, false, 'Elementary')),
    109: Team.new(entryArgsBuilder('109' as TeamID, false, 'Elementary')),
    110: Team.new(entryArgsBuilder('110' as TeamID, false, 'Elementary')),
    111: Team.new(entryArgsBuilder('111' as TeamID, false, 'Elementary')),
    112: Team.new(entryArgsBuilder('112' as TeamID, false, 'Elementary')),
  },
  // オープン部門 (多脚型のみ)
  OpenMultiWalk: {
    113: Team.new(entryArgsBuilder('113' as TeamID, false, 'Open')),
    114: Team.new(entryArgsBuilder('114' as TeamID, false, 'Open')),
    115: Team.new(entryArgsBuilder('115' as TeamID, false, 'Open')),
    116: Team.new(entryArgsBuilder('116' as TeamID, false, 'Open')),
    117: Team.new(entryArgsBuilder('117' as TeamID, false, 'Open')),
    118: Team.new(entryArgsBuilder('118' as TeamID, false, 'Open')),
  },
} as const;
