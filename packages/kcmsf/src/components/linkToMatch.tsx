import { MatchInfo } from "config";
import { Link, LinkProps } from "react-router-dom";

export const LinkToMatch = (
  props: { info: MatchInfo } & Omit<LinkProps, "to" | "state">
) => <Link to="/match" state={props.info} {...props} />;
