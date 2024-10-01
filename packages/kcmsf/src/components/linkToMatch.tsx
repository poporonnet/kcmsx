import { MatchType } from "config";
import { Link, LinkProps } from "react-router-dom";

export const LinkToMatch = (
  props: { info: { id: string; matchType: MatchType } } & Omit<
    LinkProps,
    "to" | "state"
  >
) => <Link to={`/match/${props.info.matchType}/${props.info.id}`} {...props} />;
