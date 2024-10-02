import { RunResult } from "./runResult";
import { teams } from "./team";

export interface preMatch {
  id: string;
  matchCode: `${number}-${number}`;
  leftTeam:
    | {
        id: (typeof teams)[number]["id"];
        teamName: (typeof teams)[number]["name"];
      }
    | undefined;
  rightTeam:
    | {
        id: (typeof teams)[number]["id"];
        teamName: (typeof teams)[number]["name"];
      }
    | undefined;
  runResults: RunResult[];
}

export interface mainMatch {
  id: string;
  matchCode: `${number}-${number}`;
  Team1:
    | {
        id: (typeof teams)[number]["id"];
        teamName: (typeof teams)[number]["name"];
      }
    | undefined;
  Team2:
    | {
        id: (typeof teams)[number]["id"];
        teamName: (typeof teams)[number]["name"];
      }
    | undefined;
  winnerId: (typeof teams)[number]["id"];
  runResults: RunResult[];
}

interface Matches {
  pre: preMatch[];
  main: mainMatch[];
}

export const preMatches: preMatch[] = [
  {
    id: "6582553",
    matchCode: "1-1",
    leftTeam: {
      id: "1392387",
      teamName: "かに1",
    },
    rightTeam: {
      id: "7549586",
      teamName: "かに2",
    },
    runResults: [
      {
        id: "3548129",
        teamId: "1392387",
        points: 4,
        goalTimeSeconds: 130,
        finishState: "finished",
      },
      {
        id: "13847917",
        teamId: "7549586",
        points: 4,
        finishState: "goal",
      },
    ],
  },
  {
    id: "1583452",
    matchCode: "3-1",
    leftTeam: {
      id: "4578932",
      teamName: "かに3",
    },
    rightTeam: undefined,
    runResults: [
      {
        id: "983156",
        teamId: "4578932",
        points: 8,
        goalTimeSeconds: 120,
        finishState: "finished",
      },
    ],
  },
];

export const mainMatches: mainMatch[] = [
  {
    id: "943629",
    matchCode: "2-1",
    Team1: {
      id: "1392387",
      teamName: "かに1",
    },
    Team2: {
      id: "7549586",
      teamName: "かに2",
    },
    winnerId: "1392387",
    runResults: [
      {
        id: "4279861",
        teamId: "1392387",
        points: 5,
        goalTimeSeconds: 150,
        finishState: "finished",
      },
      {
        id: "987326732",
        teamId: "7549586",
        points: 4,
        goalTimeSeconds: 130,
        finishState: "finished",
      },
    ],
  },
];

export const matches: Matches = {
  pre: preMatches,
  main: mainMatches,
};
