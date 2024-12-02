import { Cat } from "@mikuroxina/mini-fn";
import { isMatchType, MatchType } from "config";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useMatchType = (defaultType: MatchType) => {
  const [searchParams] = useSearchParams();
  const matchType = useState<MatchType>(
    Cat.cat(searchParams.get("match_type")).feed((value) =>
      value && isMatchType(value) ? value : defaultType
    ).value
  );

  return matchType;
};
