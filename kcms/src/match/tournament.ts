import { Entry, EntryID } from '../entry/entry.js';

type Tournament = [TournamentRank, TournamentRank] | [Tournament, Tournament];

const tournament = (ids: TournamentRank[] | Tournament[] | Tournament): Tournament => {
  if (ids.length == 2) return ids as Tournament; // この場合必ずTournament

  const pairs = new Array(ids.length / 2)
    .fill(null)
    .map((_, i) => [ids[i], ids[ids.length - 1 - i]] as Tournament);
  return tournament(pairs);
};

const generateDummyData = (n: number): TournamentRank[] => {
  const res: TournamentRank[] = Array<TournamentRank>();

  for (let i = 1; i < n + 1; i++) {
    res.push({
      rank: i,
      entry: Entry.new({
        id: `${i}` as EntryID,
        teamName: `チーム ${i}`,
        members: [`チーム${i}のメンバー`],
        isMultiWalk: true,
        category: i % 2 === 0 ? 'Open' : 'Elementary',
      }),
    });
  }
  return res;
};
const ids = generateDummyData(8);
export type TournamentRank = {
  rank: number;
  entry: Entry;
};
console.log({ tournament: tournament(ids) }); // => [[[1, 8],[4, 5]],[[2, 7],[3, 6]]]
