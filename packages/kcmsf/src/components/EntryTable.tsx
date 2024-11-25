import { Box, Table } from "@mantine/core";
import type { ErrorData } from "../hooks/useCheckData";
import { errorFields } from "../hooks/useCheckData";
import type { CSVRow } from "../pages/registerBulk";
export const EntryTable = (props: { data: CSVRow[]; errors: ErrorData[] }) => {
  return (
    <Box>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>チーム名</Table.Th>
            <Table.Th>メンバー1</Table.Th>
            <Table.Th>メンバー2</Table.Th>
            <Table.Th>ロボットの種別</Table.Th>
            <Table.Th>部門</Table.Th>
            <Table.Th>クラブ名</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {props.data.map((row, i) => (
            <Table.Tr key={`row-${i}`}>
              {Object.values(row).map((cell, j) => (
                <Table.Td
                  ta={"left"}
                  key={`cell-${i}-${j}`}
                  style={{
                    backgroundColor: props.errors[i]?.[errorFields[j]]
                      ? "#EC777E"
                      : "inherit",
                  }}
                >
                  {cell}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
};
