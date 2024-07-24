/**
 * @description 2チームの組を左右で表すときのキーの型
 */
export type Side = "left" | "right";

/**
 * @description 与えられる{@link Side}の反対のSideの型
 */
export type Against<S extends Side> = Side extends S ? Side : Exclude<Side, S>;

/**
 * @description リテラル型から導出される試合情報の型
 */
export type DerivedMatchInfo<
  MatchType extends string,
  DepartmentType extends string,
> = {
  id: string;
  teams: {
    [S in Side]: DerivedTeamInfo<DepartmentType>;
  };
  matchType: MatchType;
};

/**
 * @description リテラル型から導出されるチーム情報の型
 */
export type DerivedTeamInfo<DepartmentType> = {
  id: string;
  teamName: string;
  isMultiWalk: boolean;
  category: DepartmentType;
};
