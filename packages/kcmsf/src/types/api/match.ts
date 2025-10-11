import {
  CreateMainMatchManualArgs,
  MainMatch,
  Match,
  PreMatch,
  ShortMainMatch,
  ShortPreMatch,
} from "../match";
import { CreateRunResultArgs, RunResult } from "../runResult";
import { Tournament } from "../tournament";

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
 * `POST /match/pre/{departmentType}/generate/manual`のリクエスト
 */
export type GeneratePreMatchManualRequest = CreateMainMatchManualArgs;

/**
 * `POST /match/main/{departmentType}/generate/manual`のレスポンス
 */
export type GenerateMainMatchManualResponse = ShortMainMatch[];

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

/**
 * `GET /match/main/{departmentType}/tournament`のレスポンス
 */
export type GetTournament = Tournament;

/**
 * `POST /match/main/{matchID}/winner`のリクエスト
 */
export type PostMatchWinnerRequest = {
  winnerID: string;
};

/**
 * `GET /match/public`のレスポンス
 */
export type GetMatchesPublicResponse = {
  pre: PreMatch[];
  main: MainMatch[];
};
