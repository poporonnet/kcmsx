import { Entry } from '../entry/entry.js';

export const TestEntryData = {
  ElementaryMultiWalk: Entry.new({
    id: '1',
    teamName: 'TestTeam1',
    members: ['TestTaro1'],
    isMultiWalk: true,
    category: 'Elementary',
  }),
  ElementaryWheel: Entry.new({
    id: '2',
    teamName: 'TestTeam2',
    members: ['TestTaro2'],
    isMultiWalk: false,
    category: 'Elementary',
  }),
  // Openで車輪型は存在しない
  OpenMultiWalk: Entry.new({
    id: '3',
    teamName: 'TestTeam3',
    members: ['TestTaro3'],
    isMultiWalk: true,
    category: 'Open',
  }),
  OpenMultiWalk2: Entry.new({
    id: '4',
    teamName: 'TestTeam4',
    members: ['TestTaro4'],
    isMultiWalk: true,
    category: 'Open',
  }),
  // 1の重複
  ElementaryMultiWalkExists: Entry.new({
    id: '1',
    teamName: 'TestTeam1',
    members: ['TestTaro1'],
    isMultiWalk: true,
    category: 'Elementary',
  }),
  // 2の重複
  ElementaryWheelExists: Entry.new({
    id: '2',
    teamName: 'TestTeam2',
    members: ['TestTaro2'],
    isMultiWalk: false,
    category: 'Elementary',
  }),
  // 3の重複
  OpenMultiWalkExists: Entry.new({
    id: '3',
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
export const TestEntrySet = {
  // 小学生部門 多脚型
  ElementaryMultiWalk: {
    101: Entry.new(entryArgsBuilder('101', true, 'Elementary')),
    102: Entry.new(entryArgsBuilder('102', true, 'Elementary')),
    103: Entry.new(entryArgsBuilder('103', true, 'Elementary')),
    104: Entry.new(entryArgsBuilder('104', true, 'Elementary')),
    105: Entry.new(entryArgsBuilder('105', true, 'Elementary')),
    106: Entry.new(entryArgsBuilder('106', true, 'Elementary')),
  },
  // 小学生部門 車輪型
  ElementaryWheel: {
    107: Entry.new(entryArgsBuilder('107', false, 'Elementary')),
    108: Entry.new(entryArgsBuilder('108', false, 'Elementary')),
    109: Entry.new(entryArgsBuilder('109', false, 'Elementary')),
    110: Entry.new(entryArgsBuilder('110', false, 'Elementary')),
    111: Entry.new(entryArgsBuilder('111', false, 'Elementary')),
    112: Entry.new(entryArgsBuilder('112', false, 'Elementary')),
  },
  // オープン部門 (多脚型のみ)
  OpenMultiWalk: {
    113: Entry.new(entryArgsBuilder('113', false, 'Open')),
    114: Entry.new(entryArgsBuilder('114', false, 'Open')),
    115: Entry.new(entryArgsBuilder('115', false, 'Open')),
    116: Entry.new(entryArgsBuilder('116', false, 'Open')),
    117: Entry.new(entryArgsBuilder('117', false, 'Open')),
    118: Entry.new(entryArgsBuilder('118', false, 'Open')),
  },
};
