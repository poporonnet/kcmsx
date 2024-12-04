import {
  SegmentedControl,
  SegmentedControlItem,
  Table,
  Text,
} from "@mantine/core";

export const LabeledSegmentedControl = ({
  label,
  data,
  value,
  onChange,
}: {
  label: string;
  data: (string | SegmentedControlItem)[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <Table.Tr>
    <Table.Td>
      <Text
        c="dark"
        children={label}
        ta="right"
        style={{ whiteSpace: "nowrap" }}
      />
    </Table.Td>
    <Table.Td>
      <SegmentedControl w="100%" {...{ data, value, onChange }} />
    </Table.Td>
  </Table.Tr>
);
