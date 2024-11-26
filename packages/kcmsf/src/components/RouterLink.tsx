import { Box, BoxComponentProps } from "@mantine/core";
import { Link } from "react-router-dom";

export const RouterLink = ({
  to,
  children,
  ...props
}: {
  to: string;
  children: React.ReactNode;
} & BoxComponentProps) => (
  <Box component={Link} to={to} c="indigo" td="none" {...props}>
    {children}
  </Box>
);
