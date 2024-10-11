import { CreateTeamArgs, Team } from "../team";

/**
 * `GET /team`のレスポンス
 */
export type GetTeamsResponse = {
  teams: Team[];
};

/**
 * `POST /team`のリクエスト
 */
export type PostTeamsRequest = CreateTeamArgs[];

/**
 * `GET /team/{teamID}`のレスポンス
 */
export type GetTeamResponse = Team;

