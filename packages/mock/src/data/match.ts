import { RunResult } from "./runResult";
import { teams } from "./team";

export interface PreMatch {
  id: string;
  matchCode: `${number}-${number}`;
  departmentType: (typeof teams)[number]["departmentType"];
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

export interface MainMatch {
  id: string;
  matchCode: `${number}-${number}`;
  departmentType: (typeof teams)[number]["departmentType"];
  team1:
    | {
        id: (typeof teams)[number]["id"];
        teamName: (typeof teams)[number]["name"];
      }
    | undefined;
  team2:
    | {
        id: (typeof teams)[number]["id"];
        teamName: (typeof teams)[number]["name"];
      }
    | undefined;
  winnerID: (typeof teams)[number]["id"];
  runResults: RunResult[];
}

interface Matches {
  pre: PreMatch[];
  main: MainMatch[];
}

export const preMatches: PreMatch[] = [
  {
    id: "6582553",
    matchCode: "1-1",
    departmentType: "elementary",
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
        teamID: "1392387",
        points: 4,
        goalTimeSeconds: 130,
        finishState: "finished",
      },
      {
        id: "13847917",
        teamID: "7549586",
        points: 4,
        finishState: "goal",
      },
    ],
  },
  {
    id: "1583452",
    matchCode: "3-1",
    departmentType: "elementary",
    leftTeam: {
      id: "4578932",
      teamName: "かに3",
    },
    rightTeam: undefined,
    runResults: [
      {
        id: "983156",
        teamID: "4578932",
        points: 8,
        goalTimeSeconds: 120,
        finishState: "finished",
      },
    ],
  },
];

export const mainMatches: MainMatch[] = [
  {
    id: "943629",
    matchCode: "2-1",
    departmentType: "elementary",
    team1: {
      id: "1392387",
      teamName: "かに1",
    },
    team2: {
      id: "7549586",
      teamName: "かに2",
    },
    winnerID: "1392387",
    runResults: [
      {
        id: "4279861",
        teamID: "1392387",
        points: 5,
        goalTimeSeconds: 150,
        finishState: "finished",
      },
      {
        id: "987326732",
        teamID: "7549586",
        points: 4,
        goalTimeSeconds: 130,
        finishState: "finished",
      },
    ],
  },
  {
    id: "943629",
    matchCode: "2-1",
    departmentType: "open",
    team1: {
      id: "1392387",
      teamName: "かに1",
    },
    team2: {
      id: "7549586",
      teamName: "かに2",
    },
    winnerID: "1392387",
    runResults: [
      {
        id: "4279861",
        teamID: "1392387",
        points: 5,
        goalTimeSeconds: 150,
        finishState: "finished",
      },
      {
        id: "987326732",
        teamID: "7549586",
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
