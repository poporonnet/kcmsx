import { GenerateMatchService } from "./service/generate.js";
import { Result } from "@mikuroxina/mini-fn";
import { Match } from "./match.js";

export class MatchController {
  private readonly matchService: GenerateMatchService;

  constructor(matchService: GenerateMatchService) {
    this.matchService = matchService;
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

  private toJSON(i: Match) {
    const toTeamsJSON = (i: Match) =>
      i.teams.map((j) => {
        if (!j) {
          return undefined;
        }

        return {
          id: j.id,
          teamName: j.teamName,
          isMultiWalk: j.isMultiWalk,
          category: j.category,
        };
      });

    return {
      id: i.id,
      teams: toTeamsJSON(i),
      matchType: i.matchType,
      courseIndex: i.courseIndex,
      points: i.points,
      time: i.time,
      winnerID: i.winnerID,
    };
  }
}
