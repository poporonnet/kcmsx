/**
 * @description スポンサーの格
 */
export type SponsorClass = "platinum" | "gold" | "silver" | "bronze";

/**
 * @description 1つのスポンサー設定の型
 */
export type SponsorConfig = DerivedSponsorConfig<string, SponsorClass, string>;

/**
 * @description 1つのスポンサー設定の, リテラル型から導出される型
 */
export type DerivedSponsorConfig<
  Name extends string,
  Class extends SponsorClass,
  Logo extends string,
> = {
  name: Name;
  class: Class;
  logo: Logo;
};

/**
 * @description {@link Sponsors}が有効か判定する型
 * 現状はチェックなし
 */
export type ValidSponsorConfigs<Sponsors extends SponsorConfig[]> = Sponsors;
