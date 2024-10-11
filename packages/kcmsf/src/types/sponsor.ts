import { SponsorClass } from "config/src/types/sponsorConfig";

/**
 * スポンサー
 */
export type Sponsor = {
  name: string;
  class: SponsorClass;
  url: string;
};
