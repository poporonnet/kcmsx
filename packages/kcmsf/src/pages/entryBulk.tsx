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
import { Entry } from "../types/entry";
const errorMessages = {
  shortTeamName: "チーム名が短すぎます",
  shortMemberName: "メンバーの名前が短すぎます",
  invalidCategory: "部門が不正です",
  invalidRobotCategory:
    "ロボットのカテゴリーは車輪型または歩行型にしてください",
};
const notifyError = (error: keyof typeof errorMessages) => {
  notifications.show({
    title: "不正な形式のファイルです",
    message: errorMessages[error],
    color: "red",
  });
};

export const EntryBulk = () => {
  const [csvData, setCsvData] = useState<string[][] | undefined>();
  const [isError, setIsError] = useState<boolean>(false);
  const [errors, setErrors] = useState<boolean[][] | undefined>();

  useEffect(() => {
    if (csvData) {
      const newErrors = checkData(csvData);
      setErrors(newErrors);
    }
  }, [csvData]);

  const handleDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const text = await file.text();
    const data = parseCSV(text);
    setCsvData(data);
  };

  const parseCSV = (text: string): string[][] => {
    const rows = text
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((row) => row.split(","));
    //もしヘッダーの確認などでヘッダー情報が必要になるならここを変更する
    const data = rows.slice(1);
    return data;
  };

  const checkData = (data: string[][]): boolean[][] => {
    const newErrors = data.map((row) => new Array(row.length).fill(false));

    data.map((row, i) => {
      const [teamName, member1, member2, isMultiWalk, category] = row as (
        | string
        | undefined
      )[];
      if (!teamName || teamName === "") {
        notifyError("shortTeamName");
        newErrors[i][0] = true;
        setIsError(true);
      }
      if (!member1 || member1.length < 2) {
        notifyError("shortMemberName");
        newErrors[i][1] = true;
        setIsError(true);
      }
      if (member2 && member2.length < 2) {
        notifyError("shortMemberName");
        newErrors[i][2] = true;
        setIsError(true);
      }
      if (
        !isMultiWalk ||
        (isMultiWalk !== "歩行型" && isMultiWalk !== "車輪型")
      ) {
        notifyError("invalidRobotCategory");
        newErrors[i][3] = true;
        setIsError(true);
      }
      if (!category || (category !== "Elementary" && category !== "Open")) {
        notifyError("invalidCategory");
        newErrors[i][4] = true;
        setIsError(true);
      }
    });
    return newErrors;
  };

  const sendData = () => {
    if (!csvData) return;
    const data = csvData.map((row) => {
      const entry: Entry = {
        teamName: row[0],
        members: [row[1], row[2]],
        isMultiWalk: row[3] === "歩行型" ? true : false,
        category: row[4] as "Elementary" | "Open",
      };
      return entry;
    });
    console.log(data);
    setIsError(true);
    //const json = JSON.stringify(data);
    //なんかごにょごにょして後ろに渡す
  };

  const clear = () => {
    setIsError(false);
    setCsvData(undefined);
    setErrors(undefined);
  };

  return (
    <>
      <h1>一括エントリー</h1>
      {csvData && errors ? (
        <>
          <p>この内容で登録します</p>
          <Box>
            <EntryTable data={csvData} errors={errors} />
          </Box>
          <Button m={"2rem"} onClick={clear} variant="default">
            リセット
          </Button>
          <Button m={"2rem"} onClick={sendData} disabled={isError}>
            <IconSend stroke={2} />
            登録
          </Button>
        </>
      ) : (
        <Box
          maw={620}
          style={{
            boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.05)",
            borderRadius: rem(15),
          }}
          mx="auto"
          bd="2px solid gray"
          p={rem(10)}
        >
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

const EntryTable = (props: { data: string[][]; errors: boolean[][] }) => {
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
          {props.data.map((row, i) => (
            <Table.Tr key={`row-${i}`}>
              {row.map((cell, j) => (
                <Table.Td
                  ta={"left"}
                  key={`cell-${i}-${j}`}
                  style={{
                    backgroundColor: props.errors[i]?.[j] ? "#EC777E" : "inherit",
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
