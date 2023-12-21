import { Match, MatchPoints, MatchTeams } from "../match.js";
import { MatchRepository } from "../service/repository.js";
import { Result } from "@mikuroxina/mini-fn";
import { readFile, writeFile } from "node:fs/promises";
import { EntryJSON } from "../../entry/adaptor/json.js";
import { Entry } from "../../entry/entry.js";

interface JSONData {
  match: Array<MatchJSON>;
  entry: Array<object>;
}

interface MatchJSON {
  id: string;
  matchType: string;
  courseIndex: number;
  teams: [EntryJSON | undefined, EntryJSON | undefined];
  points?: [MatchPointsJSON, MatchPointsJSON];
  time?: [number, number];
  winnerID?: string;
}

interface MatchPointsJSON {
  teamID: string;
  points: number;
}

export class JSONMatchRepository implements MatchRepository {
  private readonly data: Match[];

  private constructor(data?: Array<Match>) {
    this.data = data ?? [];
  }

  public static async new(): Promise<JSONMatchRepository> {
    const data = await this.load();
    return new JSONMatchRepository(data);
  }

  public async create(match: Match): Promise<Result.Result<Error, Match>> {
    this.data.push(match);
    await this.save();
    return Result.ok(match);
  }

  private async save() {
    const data = await readFile("./data.json", "utf-8");
    const baseData = JSON.parse(data) as JSONData;

    baseData.match = this.data.map((m) => JSONMatchRepository.matchToJSON(m));
    await writeFile("./data.json", JSON.stringify(baseData), "utf-8");
  }

  private static async load(): Promise<Match[]> {
    const data = await readFile("./data.json", "utf-8");
    const parsed = JSON.parse(data) as JSONData;

    return parsed.match.map((i) => this.jsonToMatch(i));
  }

  private static matchToJSON(match: Match): MatchJSON {
    const covertToEntryJSON = (
      entry: Entry | undefined,
    ): EntryJSON | undefined => {
      if (!entry) {
        return entry;
      }

      return {
        id: entry.id,
        teamName: entry.teamName,
        members: entry.members,
        isMultiWalk: entry.isMultiWalk,
        category: entry.category,
      };
    };
    const convertToMatchPointJSON = (points: MatchPoints) => {
      return {
        teamID: points.teamID,
        points: points.points,
      };
    };
    const convertToMatchPointsJSON = (
      points: [MatchPoints, MatchPoints] | undefined,
    ): [MatchPointsJSON, MatchPointsJSON] | undefined => {
      if (!points) {
        return points;
      }
      return [
        convertToMatchPointJSON(points[0]),
        convertToMatchPointJSON(points[1]),
      ];
    };

    return {
      id: match.id,
      teams: [
        covertToEntryJSON(match.teams[0]),
        covertToEntryJSON(match.teams[1]),
      ],
      matchType: match.matchType,
      courseIndex: match.courseIndex,
      // ToDo: MatchPointsのパースをする
      points: convertToMatchPointsJSON(match.points),
      time: match.time,
      winnerID: match.winnerID,
    };
  }

  private static jsonToMatch(json: MatchJSON): Match {
    return Match.reconstruct({
      id: json.id,
      teams: json.teams as MatchTeams,
      matchType: json.matchType as "primary" | "final",
      // ToDo: MatchPointsのパース
      courseIndex: json.courseIndex,
      points: json.points,
      time: json.time,
      winnerID: json.winnerID,
    });
  }
}
