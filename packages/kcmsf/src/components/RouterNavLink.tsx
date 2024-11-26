import { NavLink, NavLinkProps } from "@mantine/core";
import { Link } from "react-router-dom";

export const RouterNavLink = ({
  to,
  label,
  ...props
}: { to: string; label: string } & NavLinkProps) => (
  <NavLink component={Link} to={to} label={label} {...props} />
);
