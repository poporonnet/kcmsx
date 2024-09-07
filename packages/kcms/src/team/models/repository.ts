import { Team } from './team.js';
import { Option, Result } from '@mikuroxina/mini-fn';

export interface TeamRepository {
  create(entry: Team): Promise<Result.Result<Error, Team>>;
  findByTeamName(name: string): Promise<Option.Option<Team>>;
  findAll(): Promise<Result.Result<Error, Array<Team>>>;
  findByID(id: string): Promise<Option.Option<Team>>;
  delete(id: string): Promise<Option.Option<Error>>;
}
