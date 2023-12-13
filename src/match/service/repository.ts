import { Match } from "../match.js";
import { Result } from "@mikuroxina/mini-fn";

export interface MatchRepository {
  // ToDo: バルクで登録できるようにする
  create(match: Match): Promise<Result.Result<Error, Match>>;
}
