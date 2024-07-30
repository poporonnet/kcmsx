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

const ErrorMessage = (errorNum: number) => {
  const message: string[] = [
    "チーム名が短すぎます。",
    "メンバーの名前が短すぎます。",
    "ロボットのカテゴリーは車輪型または歩行型にしてください。",
    "部門が不正です。",
  ];
  notifications.show({
    title: "登録失敗",
    message: "登録に失敗しました。" + message[errorNum],
    color: "red",
  });
};

export const EntryBulk = () => {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [error, setError] = useState<boolean>(true);
  const [errors, setErrors] = useState<boolean[][]>([]);

  useEffect(() => {
    if (csvData.length > 0) {
      const newErrors = checkData(csvData);
      setErrors(newErrors);
    }
  }, [csvData]);

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
    const rows = text
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((row) => row.split(","));
    return rows;
  };

  const checkData = (data: string[][]): boolean[][] => {
    const newErrors = data.map((row) => new Array(row.length).fill(false));

    data.map((row, i) => {
      const [teamName, member1, member2, isMultiWalk, category] = row;
      if (i === 0) return;
      if (teamName === undefined || teamName === "") {
        ErrorMessage(0);
        newErrors[i][0] = true;
        setError(false);
      }
      if (member1 === undefined || member1.length < 2) {
        ErrorMessage(1);
        newErrors[i][1] = true;
      }
      if (
        member2 === undefined ||
        (member2.length < 2 && member2.length !== 0)
      ) {
        ErrorMessage(1);
        newErrors[i][2] = true;
      }
      if (
        isMultiWalk === undefined ||
        (isMultiWalk !== "歩行型" && isMultiWalk !== "車輪型")
      ) {
        ErrorMessage(2);
        newErrors[i][3] = true;
        setError(false);
      }
      if (
        category === undefined ||
        (category !== "Elementary" && category !== "Open")
      ) {
        ErrorMessage(3);
        newErrors[i][4] = true;
        setError(false);
      }
    });
    return newErrors;
  };

  const sendData = () => {
    csvData.shift();
    const data = csvData.map((row) => {
      const entry: entryType = {
        teamName: row[0],
        members: [row[1], row[2]],
        isMultiWalk: row[3] === "歩行型" ? true : false,
        category: row[4] as "Elementary" | "Open",
      };
      return entry;
    });
    const json = JSON.stringify(data);
    const obj = JSON.parse(json);
    return obj;
  };

  const clear = () => {
    setError(true);
    setCsvData([]);
  };

  const showDetails = (data: string[][], errors: boolean[][]) => {
    return (
      <Box>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>チーム名</Table.Th>
              <Table.Th>メンバー1</Table.Th>
              <Table.Th>メンバー2</Table.Th>
              <Table.Th>歩行型</Table.Th>
              <Table.Th>部門</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((row, i) => (
              <Table.Tr key={i}>
                {i === 0
                  ? null
                  : row.map((cell, j) => (
                      <Table.Td
                        ta={"left"}
                        key={j}
                        style={{
                          backgroundColor:
                            errors[i] && errors[i][j] ? "#EC777E" : "inherit",
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

  return (
    <>
      <h1>一括エントリー</h1>
      {csvData.length > 0 ? (
        <>
          <p>この内容で登録します</p>
          <Box>{showDetails(csvData, errors)}</Box>
          <Button m={"2rem"} onClick={clear} variant="default">
            リセット
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
              </div>
            </Group>
          </Dropzone>
        </Box>
      )}
    </>
  );
};
