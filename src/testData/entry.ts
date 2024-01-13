import { Entry, EntryID } from '../entry/entry.js';

export const TestEntryData = {
  ElementaryMultiWalk: Entry.new({
    id: '1' as EntryID,
    teamName: 'TestTeam1',
    members: ['TestTaro1'],
    isMultiWalk: true,
    category: 'Elementary',
  }),
  ElementaryWheel: Entry.new({
    id: '2' as EntryID,
    teamName: 'TestTeam2',
    members: ['TestTaro2'],
    isMultiWalk: false,
    category: 'Elementary',
  }),
  // Openで車輪型は存在しない
  OpenMultiWalk: Entry.new({
    id: '3' as EntryID,
    teamName: 'TestTeam3',
    members: ['TestTaro3'],
    isMultiWalk: true,
    category: 'Open',
  }),
  OpenMultiWalk2: Entry.new({
    id: '4' as EntryID,
    teamName: 'TestTeam4',
    members: ['TestTaro4'],
    isMultiWalk: true,
    category: 'Open',
  }),
  // 1の重複
  ElementaryMultiWalkExists: Entry.new({
    id: '1' as EntryID,
    teamName: 'TestTeam1',
    members: ['TestTaro1'],
    isMultiWalk: true,
    category: 'Elementary',
  }),
  // 2の重複
  ElementaryWheelExists: Entry.new({
    id: '2' as EntryID,
    teamName: 'TestTeam2',
    members: ['TestTaro2'],
    isMultiWalk: false,
    category: 'Elementary',
  }),
  // 3の重複
  OpenMultiWalkExists: Entry.new({
    id: '3' as EntryID,
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
    101: Entry.new(entryArgsBuilder('101' as EntryID, true, 'Elementary')),
    102: Entry.new(entryArgsBuilder('102' as EntryID, true, 'Elementary')),
    103: Entry.new(entryArgsBuilder('103' as EntryID, true, 'Elementary')),
    104: Entry.new(entryArgsBuilder('104' as EntryID, true, 'Elementary')),
    105: Entry.new(entryArgsBuilder('105' as EntryID, true, 'Elementary')),
    106: Entry.new(entryArgsBuilder('106' as EntryID, true, 'Elementary')),
  },
  // 小学生部門 車輪型
  ElementaryWheel: {
    107: Entry.new(entryArgsBuilder('107' as EntryID, false, 'Elementary')),
    108: Entry.new(entryArgsBuilder('108' as EntryID, false, 'Elementary')),
    109: Entry.new(entryArgsBuilder('109' as EntryID, false, 'Elementary')),
    110: Entry.new(entryArgsBuilder('110' as EntryID, false, 'Elementary')),
    111: Entry.new(entryArgsBuilder('111' as EntryID, false, 'Elementary')),
    112: Entry.new(entryArgsBuilder('112' as EntryID, false, 'Elementary')),
  },
  // オープン部門 (多脚型のみ)
  OpenMultiWalk: {
    113: Entry.new(entryArgsBuilder('113' as EntryID, false, 'Open')),
    114: Entry.new(entryArgsBuilder('114' as EntryID, false, 'Open')),
    115: Entry.new(entryArgsBuilder('115' as EntryID, false, 'Open')),
    116: Entry.new(entryArgsBuilder('116' as EntryID, false, 'Open')),
    117: Entry.new(entryArgsBuilder('117' as EntryID, false, 'Open')),
    118: Entry.new(entryArgsBuilder('118' as EntryID, false, 'Open')),
  },
};
