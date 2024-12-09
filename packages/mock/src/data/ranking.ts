export interface Ranking {
  rank: number;
  teamID: string;
  teamName: string;
  points: number;
  goalTimeSeconds: number | null;
}

export const rankings = {
  pre: [
    {
      rank: 1,
      teamID: "4578932",
      teamName: "かに3",
      points: 8,
      goalTimeSeconds: null,
    },
    {
      rank: 2,
      teamID: "1392387",
      teamName: "かに1",
      points: 5,
      goalTimeSeconds: null,
    },
    {
      rank: 3,
      teamID: "7549586",
      teamName: "かに2",
      points: 4,
      goalTimeSeconds: 130,
    },
  ] as const satisfies Ranking[],
  main: [
    {
      rank: 1,
      teamID: "4578932",
      teamName: "かに3",
      points: 8,
      goalTimeSeconds: null,
    },
    {
      rank: 2,
      teamID: "1392387",
      teamName: "かに1",
      points: 5,
      goalTimeSeconds: null,
    },
  ] as const satisfies Ranking[],
};
