export type DerivedTeamInfo<DepartmentType> = {
  id: string;
  teamName: string;
  isMultiWalk: boolean;
  category: DepartmentType;
};

export type Side = "left" | "right";
export type Against<S extends Side> = Side extends S ? Side : Exclude<Side, S>;

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
