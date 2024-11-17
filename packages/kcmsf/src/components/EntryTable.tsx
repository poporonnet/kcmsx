import { Box, Table } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { ErrorData, useCheckData } from "../hooks/useCheckData";
import { CSVRow } from "../pages/registerBulk";

export const EntryTable = (props: { data: CSVRow[] }) => {
  const errors = useCheckData(props.data ?? []);

  // エラー通知
  useEffect(() => {
    if (errors && errors.length > 0) {
      const allErrors = errors.flatMap((error) =>
        Object.values(error).flatMap((value) => value)
      );
      console.log("allErrors ", allErrors);
      const notify = new Set(allErrors);
      notify.forEach((message) => {
        notifications.show({
          title: "不正な形式のファイルです",
          message: message,
          color: "red",
        });
      });
    }
  }, [errors]);

  const errorFields: (keyof ErrorData)[] = [
    "teamName",
    "member1",
    "member2",
    "robotType",
    "departmentType",
    "clubName",
  ];
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
                      errors[i][errorFields[j]] &&
                      errors[i][errorFields[j]].length > 0
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
