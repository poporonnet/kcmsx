import { isMatchType, MatchType } from "config";
import { useQueryParamsState } from "./useQueryParamsState";

export const useMatchTypeQuery = (defaultType: MatchType) =>
  useQueryParamsState("match_type", defaultType, isMatchType);
