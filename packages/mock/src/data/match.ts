import { RunResult } from "./runResult";
import { teams } from "./team";

export interface Match {
  id: string;
  matchCode: `${number}-${number}`;
  left:
    | {
        id: (typeof teams)[number]["id"];
        teamName: (typeof teams)[number]["name"];
      }
    | {};
  right:
    | {
        id: (typeof teams)[number]["id"];
        teamName: (typeof teams)[number]["name"];
      }
    | {};
  winnerId?: (typeof teams)[number]["id"];
  runResults: RunResult[];
}

interface Matches {
  pre: Match[];
  main: Match[];
}

export const preMatches: Match[] = [
  {
    id: "6582553",
    matchCode: "1-1",
    left: {
      id: "1392387",
      teamName: "かに1",
    },
    right: {
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
        finishState: "retired",
      },
    ],
  },
  {
    id: "1583452",
    matchCode: "3-1",
    left: {
      id: "4578932",
      teamName: "かに3",
    },
    right: {},
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

export const mainMatches: Match[] = [
  {
    id: "943629",
    matchCode: "2-1",
    left: {
      id: "1392387",
      teamName: "かに1",
    },
    right: {
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
