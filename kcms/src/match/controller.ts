import { GenerateFinalMatchService } from './service/generateFinal.js';
import { Result } from '@mikuroxina/mini-fn';
import { Match } from './match.js';
import { EditMatchService } from './service/edit.js';
import { Entry, EntryID } from '../entry/entry.js';
import { GetMatchService } from './service/get.js';
import { GeneratePrimaryMatchService } from './service/generatePrimary.js';

export class MatchController {
  private readonly matchService: GenerateFinalMatchService;
  private readonly primaryService: GeneratePrimaryMatchService;
  private readonly editService: EditMatchService;
  private readonly getService: GetMatchService;

  constructor(
    matchService: GenerateFinalMatchService,
    editService: EditMatchService,
    getService: GetMatchService,
    primaryService: GeneratePrimaryMatchService
  ) {
    this.matchService = matchService;
    this.editService = editService;
    this.getService = getService;
    this.primaryService = primaryService;
  }

  async generateMatch(
    type: string,
    category: string
  ): Promise<Result.Result<Error, matchJSON[][]>> {
    if (type === 'primary') {
      if (category === 'open') return Result.err(new Error('cant generate open primary matches'));

      const res = await this.generatePrimary();
      if (Result.isErr(res)) {
        return Result.err(new Error('failed to generate primary matches'));
      }
      return Result.ok(res[1]);
    } else if (type === 'final') {
      const res = await this.generateFinal(category);
      if (Result.isErr(res)) {
        return Result.err(new Error('failed to generate final matches'));
      }
      return Result.ok([res[1]]);
    }
    return Result.err(new Error('invalid match type'));
  }

  private async generatePrimary(): Promise<Result.Result<Error, matchJSON[][]>> {
    const res = await this.primaryService.generatePrimaryMatch();
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }
    return Result.ok(
      res[1].map((i) => {
        return i.map((v) => this.toJSON(v.toDomain()));
      })
    );
  }

  async editMatch(id: string, args: matchUpdateJSON): Promise<Result.Result<Error, matchJSON>> {
    const res = await this.editService.handle(id, args);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }

    return Result.ok(this.toJSON(res[1].toDomain()));
  }

  async getMatchByType(matchType: string) {
    const res = await this.getService.findByType(matchType);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }
    return Result.ok(res[1].map((i) => this.toJSON(i.toDomain())));
  }

  async generateFinal(category: string): Promise<Result.Result<Error, matchJSON[]>> {
    if (!(category === 'elementary' || category === 'open')) {
      return Result.err(new Error('invalid match type'));
    }
    const res = await this.matchService.handle(category);
    if (Result.isErr(res)) {
      return Result.err(res[1]);
    }
    return Result.ok(res[1].map((v) => this.toJSON(v)));
  }

  private toJSON(i: Match): matchJSON {
    const toTeamJSON = (i?: Entry): matchTeamJSON | undefined => {
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
        left: toTeamJSON(i.teams.left),
        right: toTeamJSON(i.teams.right),
      },
      matchType: i.matchType,
      courseIndex: i.courseIndex,
      results: i.results,
    };
  }
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

interface matchUpdateJSON {
  results: matchResultPairJSON | matchResultFinalPairJSON;
}

interface matchTeamJSON {
  id: string;
  teamName: string;
  isMultiWalk: boolean;
  category: string;
}

interface matchJSON {
  id: string;
  teams: {
    left: undefined | matchTeamJSON;
    right: undefined | matchTeamJSON;
  };
  matchType: 'primary' | 'final';
  courseIndex: number;
  results: matchResultPairJSON | matchResultFinalPairJSON | undefined;
}
