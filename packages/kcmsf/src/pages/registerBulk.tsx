import { Box, Button, Group, Paper, rem, Text, Title } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import {
  IconFileTypeCsv,
  IconSend,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import type { DepartmentType, RobotType } from "config";
import { useEffect, useState } from "react";
import { CsvExample } from "../components/CsvExample";
import { EntryTable } from "../components/EntryTable";
import { useCheckData } from "../hooks/useCheckData";
import type { PostTeamsRequest } from "../types/api/team";
import type { CreateTeamArgs } from "../types/team";
import { notifyError } from "../utils/notifyError";

// CSVの1行を表す型
export type CSVRow = {
  teamName: string;
  member1: string;
  member2: string;
  robotType: string;
  departmentType: string;
  clubName: string;
};
export const RegisterBulk = () => {
  const [csvData, setCsvData] = useState<CSVRow[]>();
  const errors = useCheckData(csvData ?? []);
  const handleDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const text = await file.text();
    const data = parseCSV(text);
    setCsvData(data);
  };

  useEffect(() => {
    // エラーがあれば通知
    if (errors && errors.length > 0) {
      const allErrors = errors.flatMap((error) => Object.values(error));
      const notify = new Set(allErrors);
      for (const message of notify) {
        if (message !== undefined) notifyError(message);
      }
    }
  }, [errors]);

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
      robotType: row[3],
      departmentType: row[4],
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
        robotType: row.robotType as RobotType,
        departmentType: row.departmentType as DepartmentType,
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

  return (
    <>
      <Title>一括エントリー</Title>
      {csvData ? (
        <>
          <p>この内容で登録します</p>
          <Box>
            <EntryTable data={csvData} errors={errors} />
          </Box>
          <Button
            m={"2rem"}
            onClick={() => setCsvData(undefined)}
            variant="default"
          >
            リセット
          </Button>
          <Button m={"2rem"} onClick={sendData}>
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
      <CsvExample />
    </>
  );
};
