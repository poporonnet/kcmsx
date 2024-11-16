import {
  Box,
  Button,
  Code,
  Group,
  Paper,
  rem,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import {
  IconFileTypeCsv,
  IconSend,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { config, type DepartmentType, type RobotType } from "config";
import { useState } from "react";
import type { PostTeamsRequest } from "../types/api/team";
import type { CreateTeamArgs } from "../types/team";
import { checkData } from "../utils/checkBulkData";

// CSVの1行を表す型
export type CSVRow = {
  teamName: string;
  member1: string;
  member2: string;
  robotType: RobotType;
  departmentType: DepartmentType;
  clubName: string;
};

const csvDescription = {
  name: "1文字以上。重複できない。",
  member1: "3文字以上。",
  member2: "3文字以上。1人の場合は空欄。",
  robotType: config.robotTypes.join("または"),
  departmentType: config.departmentTypes.join("または"),
  clubName: "所属していなければ空欄。",
};

export const RegisterBulk = () => {
  const [csvData, setCsvData] = useState<CSVRow[]>();
  const [isError, setIsError] = useState<boolean>(false);
  const [errors, setErrors] = useState<boolean[][]>();

  const handleDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const text = await file.text();
    const data = parseCSV(text);
    setCsvData(data);

    const { newErrors, isError } = checkData(data);
    setErrors(newErrors);
    setIsError(isError);
  };

  // CSVのテキストをパースして、CSVRowの配列に変換
  const parseCSV = (text: string): CSVRow[] => {
    const rows = text
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((row) => row.split(","));
    // ヘッダーを除外
    const dataRows = rows.slice(1);

    // CSVRow型に変換
    const parsedData: CSVRow[] = dataRows.map((row) => ({
      teamName: row[0],
      member1: row[1],
      member2: row[2],
      robotType: row[3] as RobotType,
      departmentType: row[4] as DepartmentType,
      clubName: row[5],
    }));

    return parsedData;
  };

  const sendData = async () => {
    if (!csvData) return;
    const data: PostTeamsRequest = csvData.map(
      (row): CreateTeamArgs => ({
        name: row.teamName,
        members: [row.member1, row.member2],
        robotType: row.robotType,
        departmentType: row.departmentType,
        clubName: row.clubName,
      })
    );
    const res = await fetch(`${import.meta.env.VITE_API_URL}/team`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      notifications.show({
        title: "登録完了",
        message: "登録が完了しました",
        color: "green",
      });
    } else {
      notifications.show({
        title: "登録失敗",
        message: "登録に失敗しました",
        color: "red",
      });
    }
  };

  const clear = () => {
    setIsError(false);
    setCsvData(undefined);
    setErrors(undefined);
  };

  return (
    <>
      <Text>一括エントリー</Text>
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
        <Paper
          maw={620}
          mx="auto"
          bd="2px solid gray"
          p={rem(10)}
          radius="xl"
          shadow="sm"
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
            style={{ cursor: "pointer" }}
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
        </Paper>
      )}
      <Paper p="xl" mt={16}>
        <Title order={3}>CSVの形式</Title>
        <DescriptionTable />
        <RegisterBulkSample />
      </Paper>
    </>
  );
};

const EntryTable = (props: { data: CSVRow[]; errors: boolean[][] }) => {
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
                    backgroundColor: props.errors[i]?.[j]
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

const DescriptionTable = () => {
  return (
    <Table mb={10} striped withTableBorder horizontalSpacing="md">
      <Table.Thead>
        <Table.Tr>
          <Table.Th ta="center">カラム名</Table.Th>
          <Table.Th ta="center">制約</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {Object.entries(csvDescription).map(([key, value]) => (
          <Table.Tr key={key}>
            <Table.Td ta="center">
              <Text>{key}</Text>
            </Table.Td>
            <Table.Td ta="left">
              <Text>{value}</Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

const RegisterBulkSample = () => {
  const sampleCsv = `name,member1,member2,robotType,departmentType,clubName 
はなびらちーむ,さくら,あお,leg,elementary,Rubyクラブ
優勝するぞ,ちひろ,,${config.robotTypes[0]},elementary,
ひまわり,ゆうた,ゆうと,leg,${config.departmentTypes[0]},`;

  return (
    <>
      <Title order={3}>CSVの例</Title>
      <Code block ta={"left"}>
        {sampleCsv}
      </Code>
    </>
  );
};
