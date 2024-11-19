import { Box, Table } from "@mantine/core";
import { useEffect } from "react";
import { errorFields, useCheckData } from "../hooks/useCheckData";
import type { CSVRow } from "../pages/registerBulk";
import { notifyError } from "../utils/notifyError";

export const EntryTable = (props: { data: CSVRow[] }) => {
  const errors = useCheckData(props.data ?? []);

  // エラー通知
  useEffect(() => {
    if (errors && errors.length > 0) {
      const allErrors = errors.flatMap((error) =>
        Object.values(error).flatMap((value) => value)
      );
      const notify = new Set(allErrors);
      for (const message of notify) {
        if (message) notifyError(message);
      }
    }
  }, [errors]);

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
                    backgroundColor:
                      errors[i] && errors[i][errorFields[j]]
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
