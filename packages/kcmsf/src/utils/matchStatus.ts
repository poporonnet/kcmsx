import { StatusButtonProps } from "../components/matchStatus";
import { Match } from "../types/match";

export const getMatchStatus = (match: Match): StatusButtonProps["status"] => {
  if (match.matchType === "main" && match.runResults.length === 2) return "now";
  return match.runResults.length === 0 ? "future" : "end";
};
