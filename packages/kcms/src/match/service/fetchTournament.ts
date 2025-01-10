import { Result } from '@mikuroxina/mini-fn';
import { DepartmentType } from 'config';
import { MainMatch, MainMatchID } from '../model/main';
import { GetMatchService } from './get';

export type Tournament = {
  match: MainMatch;
  childMatch1?: Tournament;
  childMatch2?: Tournament;
};

export class FetchTournamentService {
  constructor(private readonly getMatch: GetMatchService) {}

  async handle(departmentType: DepartmentType): Promise<Result.Result<Error, Tournament>> {
    const mainRes = await this.getMatch.findAllMainMatch();
    if (Result.isErr(mainRes)) {
      return mainRes;
    }

    const matches = Result.unwrap(mainRes).filter(
      (match) => match.getDepartmentType() === departmentType
    );
    const matchMap = new Map(matches.map((match) => [match.getID(), match]));
    const rootMatch = matches.find((match) => !match.getParentID());
    if (!rootMatch) {
      return Result.err(new Error('Parent not found'));
    }

    const tournament = this.buildTournament(rootMatch, (id) => matchMap.get(id)!);
    return Result.ok(tournament);
  }

  private buildTournament(match: MainMatch, getMatch: (id: MainMatchID) => MainMatch): Tournament {
    const children = match.getChildMatches();
    if (!children) return { match };

    const { match1: childMatch1, match2: childMatch2 } = children;
    return {
      match,
      childMatch1: childMatch1 && this.buildTournament(getMatch(childMatch1.getID()), getMatch),
      childMatch2: childMatch2 && this.buildTournament(getMatch(childMatch2.getID()), getMatch),
    };
  }
}
