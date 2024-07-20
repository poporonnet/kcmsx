import { DerivedPremiseState } from "../premise";
import { DepartmentType, MatchType } from "./config";
import { PointState } from "./rule";

export type PremiseState = DerivedPremiseState<
  MatchType,
  DepartmentType,
  PointState
>;
