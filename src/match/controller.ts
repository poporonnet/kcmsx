import { GenerateMatchService } from "./service/generate.js";
import { Result } from "@mikuroxina/mini-fn";
import { Match } from "./match.js";
import { EditMatchService } from "./service/edit.js";
import { Entry } from "../entry/entry.js";

export class MatchController {
  private readonly matchService: GenerateMatchService;
  private readonly editService: EditMatchService;

  constructor(
    matchService: GenerateMatchService,
    editService: EditMatchService,
  ) {
    this.matchService = matchService;
    this.editService = editService;
  }

  async generateMatch(type: string) {
    switch (type) {
      case "primary":
        return await this.generatePrimary();
      default:
        return Result.err(new Error("unknown match type"));
    }
  }

  private async generatePrimary() {
    const res = await this.matchService.generatePrimaryMatch();
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }
    return Result.ok(res[1].map((i) => i.map(this.toJSON)));
  }

  async editMatch(id: string, args: matchUpdateJSON) {
    const res = await this.editService.handle(id, args);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    return Result.ok(this.toJSON(res[1].toDomain()));
  }

  private toJSON(i: Match) {
    const toTeamJSON = (i?: Entry) => {
      if (!i) {
        return i;
      }

      return {
        id: i.id,
        teamName: i.teamName,
        isMultiWalk: i.isMultiWalk,
        category: i.category,
      };
    };

    return {
      id: i.id,
      teams: {
        left: toTeamJSON(i.teams.Left),
        right: toTeamJSON(i.teams.Right),
      },
      matchType: i.matchType,
      courseIndex: i.courseIndex,
      results: i.results,
    };
  }
}

interface matchResultJSON {
  teamID: string;
  points: number;
  time: number;
}
interface matchResultPairJSON {
  Left: matchResultJSON;
  Right: matchResultJSON;
}
interface matchResultFinalPairJSON {
  results: [matchResultPairJSON, matchResultPairJSON];
  winnerID: string;
}
interface matchUpdateJSON {
  results: matchResultPairJSON | matchResultFinalPairJSON;
}
