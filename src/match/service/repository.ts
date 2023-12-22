import { Match } from "../match.js";
import { Option, Result } from "@mikuroxina/mini-fn";

export interface MatchRepository {
  // ToDo: バルクで登録できるようにする
  create(match: Match): Promise<Result.Result<Error, Match>>;
  findByID(id: string): Promise<Option.Option<Match>>;
  update(match: Match): Promise<Result.Result<Error, Match>>;
}
