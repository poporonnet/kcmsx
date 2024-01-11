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
