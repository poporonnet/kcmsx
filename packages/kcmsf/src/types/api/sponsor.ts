import { Sponsor } from "../sponsor";

/**
 * `GET /sponsor` のレスポンス
 */
export type GetSponsorResponse = {
  sponsors: Sponsor[];
};
