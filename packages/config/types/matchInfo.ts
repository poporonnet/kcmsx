export type DerivedTeamInfo<DepartmentType> = {
  id: string;
  teamName: string;
  isMultiWalk: boolean;
  category: DepartmentType;
};

export type Side = "left" | "right";

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
