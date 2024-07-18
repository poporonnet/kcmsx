import { Box, Button, Group, Table, Text, rem } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import {
  IconFileTypeCsv,
  IconSend,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Entry as entryType } from "../types/entry";

const Errormeg = (errorNum: number) => {
  const message: string[] = [
    "チーム名が短すぎます",
    "メンバーの名前が短すぎます",
    "部門が不正です.",
  ];
  notifications.show({
    title: "登録失敗",
    message: "登録に失敗しました." + message[errorNum],
    color: "red",
  });
};

export const BulkEntry = () => {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [error, setError] = useState<boolean>(true);
  useEffect(() => {
    console.log("check");
    checkData(csvData);
  }),[csvData];
  const handleDrop = (files: File[]) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        const data = parseCSV(text);
        setCsvData(data);
      };
      reader.readAsText(file);
    }
  };
  const parseCSV = (text: string): string[][] => {
    const rows = text.split("\n").map((row) => row.split(","));
    return rows;
  };
  const checkData = (data: string[][]) => {
    data.map((row, i) => {
      if (i === 0) return;
      if (row[0] === "") {
        Errormeg(0);
        setError(false);
      }
      if (row[1].length < 2) Errormeg(1);
      if (row[2].length < 2 && row[2].length != 0) Errormeg(1);
      if (
        row[4].split("\r")[0] !== "Elementary" &&
        row[4].split("\r")[0] !== "Open"
      ) {
        Errormeg(2);
        setError(false);
      }
    });
    return "";
  };
  const sendData = () => {
    const data = csvData.map((row) => {
      const entry: entryType = {
        teamName: row[0],
        members: [row[1], row[2]],
        isMultiWalk: row[3] === "true",
        category: row[4] as "Elementary" | "Open",
      };
      return entry;
    });
    const json = JSON.stringify(data);
    const obj = JSON.parse(json);
    console.log("send");
    return obj;
  };
  const clear = () => {
    setCsvData([]);
  };
  const showDetails = (data: string[][]) => {
    return (
      <Box>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>チーム名</Table.Th>
              <Table.Th>メンバー1</Table.Th>
              <Table.Th>メンバー2</Table.Th>
              <Table.Th>多足歩行</Table.Th>
              <Table.Th>部門</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((row, i) => (
              <Table.Tr key={i}>
                {i === 0
                  ? null
                  : row.map((cell, j) => (
                      <Table.Td ta={"left"} key={j}>
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
  return (
    <>
      <h1>一括エントリー</h1>
      {csvData.length > 0 ? (
        <>
          <p>この内容で登録します</p>
          <Box>{showDetails(csvData)}</Box>
          {/* 色を変える */}
          <Button m={"2rem"} onClick={clear} variant="default">
            別のCSVを登録する
          </Button>
          {error ? (
            <Button m={"2rem"} onClick={sendData}>
              <IconSend stroke={2} />
              登録
            </Button>
          ) : (
            <Button m={"2rem"} onClick={sendData} disabled>
              <IconSend stroke={2} />
              登録
            </Button>
          )}
        </>
      ) : (
        <Box maw={620} mx={"auto"} bd="3px solid gray.6" p={rem(10)}>
          <Dropzone
            onDrop={handleDrop}
            onReject={() => (
              <Text c={"red"} fw={700}>
                CSVファイル以外のものは登録できません。
              </Text>
            )}
            maxSize={5 * 1024 ** 2}
            accept={["text/csv"]}
          >
            <Group
              justify="center"
              gap="xl"
              mih={220}
              style={{ pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <IconUpload
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-blue-6)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-red-6)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconFileTypeCsv
                  style={{
                    width: rem(52),
                    height: rem(52),
                    color: "var(--mantine-color-dimmed)",
                  }}
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  ここにCSVファイルをドラッグ&ドロップしてください
                </Text>
                {/* <Text size="sm" c="dimmed" inline mt={7}>
          Attach as many files as you like, each file should not exceed 5mb
        </Text> */}
              </div>
            </Group>
          </Dropzone>
        </Box>
      )}
    </>
  );
};
