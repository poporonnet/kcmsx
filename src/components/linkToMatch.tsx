import { Link, LinkProps } from "react-router-dom";
import { MatchInfo } from "../pages/match";

export const LinkToMatch = (
  props: { info: MatchInfo } & Omit<LinkProps, "to" | "state">
) => <Link to="/match" state={props.info} {...props} />;
