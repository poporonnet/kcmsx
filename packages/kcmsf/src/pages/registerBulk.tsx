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
import {
  config,
  DepartmentType,
  isDepartmentType,
  isRobotType,
  RobotType,
} from "config";
import { useEffect, useState } from "react";
import { PostTeamsRequest } from "../types/api/team";
import { CreateTeamArgs } from "../types/team";

const errorMessages = {
  shortTeamName: "チーム名が短すぎます",
  shortMemberName: "メンバーの名前が短すぎます",
  invalidCategory: "部門が不正です",
  invalidRobotCategory:
    "ロボットのカテゴリーは車輪型または歩行型にしてください",
  shortClubName: "クラブ名が短すぎます",
};
const notifyError = (error: keyof typeof errorMessages) => {
  notifications.show({
    title: "不正な形式のファイルです",
    message: errorMessages[error],
    color: "red",
  });
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
    return rows.slice(1);
  };

  const checkData = (data: string[][]): boolean[][] => {
    const newErrors = data.map((row) => new Array(row.length).fill(false));

    data.map((row, i) => {
      const [teamName, member1, member2, robotType, department, clubName] =
        row as (string | undefined)[];
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
      if (!department || !isDepartmentType(department)) {
        notifyError("invalidCategory");
        newErrors[i][4] = true;
        setIsError(true);
      }
      if (clubName && clubName.length < 1) {
        notifyError("shortClubName");
        newErrors[i][5] = true;
        setIsError(true);
      }
      if (
        !robotType ||
        !isRobotType(robotType) ||
        !department ||
        !isDepartmentType(department) ||
        !config.department[department].robotTypes.find((v) => v === robotType)
      ) {
        notifyError("invalidRobotCategory");
        newErrors[i][3] = true;
        setIsError(true);
      }
    });
    return newErrors;
  };

  const sendData = async () => {
    if (!csvData) return;
    const data: PostTeamsRequest = csvData.map(
      (row): CreateTeamArgs => ({
        name: row[0],
        members: [row[1], row[2]],
        robotType: row[3] as RobotType,
        departmentType: row[4] as DepartmentType,
        clubName: row[5],
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

const EntryTable = (props: { data: string[][]; errors: boolean[][] }) => {
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
              {row.map((cell, j) => (
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
