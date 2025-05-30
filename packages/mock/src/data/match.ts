import { config } from "config";
import { RunResult } from "./runResult";
import { teams } from "./team";

export interface PreMatch {
  id: string;
  matchCode: `${number}-${number}`;
  matchType: "pre";
  departmentType: (typeof teams)[number]["departmentType"];
  leftTeam?: {
    id: (typeof teams)[number]["id"];
    teamName: (typeof teams)[number]["name"];
  };
  rightTeam?: {
    id: (typeof teams)[number]["id"];
    teamName: (typeof teams)[number]["name"];
  };
  runResults: RunResult[];
}

export interface MainMatch {
  id: string;
  matchCode: `${number}-${number}`;
  matchType: "main";
  departmentType: (typeof teams)[number]["departmentType"];
  team1: {
    id: (typeof teams)[number]["id"];
    teamName: (typeof teams)[number]["name"];
  };
  team2: {
    id: (typeof teams)[number]["id"];
    teamName: (typeof teams)[number]["name"];
  };
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
    matchType: "pre",
    departmentType: config.departmentTypes[0],
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
        points: 5,
        goalTimeSeconds: null,
        finishState: "finished",
      },
      {
        id: "13847917",
        teamID: "7549586",
        points: 4,
        goalTimeSeconds: 130,
        finishState: "goal",
      },
    ],
  },
  {
    id: "1583452",
    matchCode: "3-1",
    matchType: "pre",
    departmentType: config.departmentTypes[0],
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
        goalTimeSeconds: null,
        finishState: "finished",
      },
    ],
  },
];

export const mainMatches: MainMatch[] = [
  {
    id: "943629",
    matchCode: "2-1",
    matchType: "main",
    departmentType: config.departmentTypes[0],
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
        finishState: "goal",
      },
      {
        id: "987326732",
        teamID: "7549586",
        points: 4,
        goalTimeSeconds: 130,
        finishState: "goal",
      },
      {
        id: "68963290",
        teamID: "7549586",
        points: 6,
        goalTimeSeconds: null,
        finishState: "finished",
      },
      {
        id: "5640890",
        teamID: "1392387",
        points: 5,
        goalTimeSeconds: 120,
        finishState: "goal",
      },
    ],
  },
  {
    id: "874381",
    matchCode: "2-2",
    matchType: "main",
    departmentType: config.departmentTypes[0],
    team1: {
      id: "4578932",
      teamName: "かに3",
    },
    team2: {
      id: "7549586",
      teamName: "かに2",
    },
    winnerID: "4578932",
    runResults: [
      {
        id: "4279861",
        teamID: "4578932",
        points: 5,
        goalTimeSeconds: 150,
        finishState: "goal",
      },
      {
        id: "987326732",
        teamID: "4578932",
        points: 4,
        goalTimeSeconds: null,
        finishState: "finished",
      },
      {
        id: "987326732",
        teamID: "7549586",
        points: 3,
        goalTimeSeconds: null,
        finishState: "finished",
      },
      {
        id: "4279861",
        teamID: "7549586",
        points: 5,
        goalTimeSeconds: 150,
        finishState: "goal",
      },
    ],
  },
];

export const matches: Matches = {
  pre: preMatches,
  main: mainMatches,
};
