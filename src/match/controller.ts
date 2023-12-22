import { GenerateMatchService } from "./service/generate.js";
import { Result } from "@mikuroxina/mini-fn";
import { Match } from "./match.js";
import { EditMatchService } from "./service/edit.js";

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
    // winnerIDなどがundefinedになる
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

interface matchUpdateJSON {
  points?: [
    { teamID: string; points: number },
    { teamID: string; points: number },
  ];
  time?: [number, number];
  winnerID?: string;
}
