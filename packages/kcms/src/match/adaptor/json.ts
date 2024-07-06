import { MatchID, Match, MatchTeams } from '../match.js';
import { MatchRepository } from '../service/repository.js';
import { Option, Result } from '@mikuroxina/mini-fn';
import { readFile, writeFile } from 'node:fs/promises';
import { EntryJSON } from '../../entry/adaptor/json.js';
import { Entry, EntryID } from '../../entry/entry.js';

interface JSONData {
  match: Array<MatchJSON>;
  entry: Array<object>;
}

interface matchResultJSON {
  teamID: EntryID;
  points: number;
  time: number;
}

interface matchResultPairJSON {
  left: matchResultJSON;
  right: matchResultJSON;
}

interface matchResultFinalPairJSON {
  results: [matchResultPairJSON, matchResultPairJSON];
  winnerID: EntryID;
}

interface MatchJSON {
  id: string;
  matchType: string;
  courseIndex: number;
  teams: {
    left: EntryJSON | undefined;
    right: EntryJSON | undefined;
  };
  results?: matchResultPairJSON | matchResultFinalPairJSON;
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

  public async createBulk(matches: Match[]): Promise<Result.Result<Error, Match[]>> {
    this.data.push(...matches);
    await this.save();
    return Result.ok(matches);
  }

  public async findByID(id: string): Promise<Option.Option<Match>> {
    const match = this.data.find((m) => m.getId() === id);
    if (!match) {
      return Option.none();
    }

    return Option.some(match);
  }

  public async findByType(type: string): Promise<Option.Option<Match[]>> {
    const match = this.data.filter((m) => m.getMatchType() === type);
    if (!match) {
      return Option.none();
    }
    return Option.some(match);
  }

  public async findAll(): Promise<Result.Result<Error, Match[]>> {
    return Result.ok(this.data);
  }

  public async update(match: Match): Promise<Result.Result<Error, Match>> {
    const i = this.data.findIndex((m) => m.getId === match.getId);
    this.data[i] = match;

    await this.save();
    return Result.ok(match);
  }

  private async save() {
    const data = await readFile('./data.json', 'utf-8');
    const baseData = JSON.parse(data) as JSONData;

    baseData.match = this.data.map((m) => JSONMatchRepository.matchToJSON(m));
    await writeFile('./data.json', JSON.stringify(baseData), 'utf-8');
  }

  private static async load(): Promise<Match[]> {
    const data = await readFile('./data.json', 'utf-8');
    const parsed = JSON.parse(data) as JSONData;

    return parsed.match.map((i) => this.jsonToMatch(i));
  }

  private static matchToJSON(match: Match): MatchJSON {
    const covertToEntryJSON = (entry: Entry | undefined): EntryJSON | undefined => {
      if (!entry) {
        return entry;
      }

      return {
        id: entry.getId(),
        teamName: entry.getTeamName(),
        members: entry.getMembers(),
        isMultiWalk: entry.getIsMultiWalk(),
        category: entry.getCategory(),
      };
    };

    return {
      id: match.getId(),
      teams: {
        left: covertToEntryJSON(match.getTeams().left),
        right: covertToEntryJSON(match.getTeams().right),
      },
      matchType: match.getMatchType(),
      courseIndex: match.getCourseIndex(),
      results: match.getResults(),
    };
  }

  private static jsonToMatch(json: MatchJSON): Match {
    return Match.reconstruct({
      id: json.id as MatchID,
      teams: json.teams as MatchTeams,
      matchType: json.matchType as 'primary' | 'final',
      // ToDo: MatchPointsのパース
      courseIndex: json.courseIndex,
      results: json.results,
    });
  }
}
