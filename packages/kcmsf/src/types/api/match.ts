import {
  MainMatch,
  Match,
  PreMatch,
  ShortMainMatch,
  ShortPreMatch,
} from "../match";
import { CreateRunResultArgs, RunResult } from "../runResult";

/**
 * `GET /match`のレスポンス
 */
export type GetMatchesResponse = {
  pre: PreMatch[];
  main: MainMatch[];
};

/**
 * `POST /match/{matchType}/{departmentType}/generate`のレスポンス
 */
export type GenerateMatchResponse = ShortPreMatch[] | ShortMainMatch[];

/**
 * `GET /match/{matchType}/{matchID}`のレスポンス
 */
export type GetMatchResponse = Match;

/**
 * `GET /match/{matchType}`のレスポンス
 */
export type GetMatchesByTypeResponse = PreMatch[] | MainMatch[];

/**
 * `GET /match/{matchType}/{matchID}/run_result`のレスポンス
 */
export type GetMatchRunResultResponse = RunResult[];

/**
 * `POST /match/{matchType}/{matchID}/run_result`のリクエスト
 */
export type PostMatchRunResultRequest = CreateRunResultArgs[];
