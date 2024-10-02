import { MatchType } from "config";
import { Link, LinkProps } from "react-router-dom";

export const LinkToMatch = (
  props: { id: string; matchType: MatchType } & Omit<LinkProps, "to" | "state">
) => <Link to={`/match/${props.matchType}/${props.id}`} {...props} />;
