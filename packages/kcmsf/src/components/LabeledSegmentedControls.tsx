import { Table } from "@mantine/core";
import React from "react";

export const LabeledSegmentedControls = ({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) => (
  <Table
    withRowBorders={false}
    w="fit-content"
    horizontalSpacing="0.5rem"
    verticalSpacing="0.2rem"
  >
    {children}
  </Table>
);
