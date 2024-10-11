import { RankingRecord } from "../contest";

/**
 * `GET /contest/{matchType}/{departmentType}/ranking`のレスポンス
 */
export type GetRankingResponse = RankingRecord[];
