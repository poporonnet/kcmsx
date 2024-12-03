import { StatusButtonProps } from "../components/matchStatus";
import { Match } from "../types/match";

export const getMatchStatus = (match: Match): StatusButtonProps["status"] => {
  if (match.runResults.length == 0) return "future";

  const maxRunResultLength = { pre: 2, main: 4 }[match.matchType];
  return match.runResults.length < maxRunResultLength ? "now" : "end";
};
