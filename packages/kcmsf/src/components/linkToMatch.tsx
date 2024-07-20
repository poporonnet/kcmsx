import { Link, LinkProps } from "react-router-dom";
import { MatchInfo } from "config/types/derived/matchInfo";

export const LinkToMatch = (
  props: { info: MatchInfo } & Omit<LinkProps, "to" | "state">
) => <Link to="/match" state={props.info} {...props} />;
