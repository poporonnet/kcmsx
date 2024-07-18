import { Box, Button, Group, Table, Text, rem } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import {
  IconFileTypeCsv,
  IconSend,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
export const BulkEntry = () => {
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  useEffect(() => {
    dropzoneRef.current?.focus();
  }, []);
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
          <h2>内容</h2>
          <Box>{showDetails(csvData)}</Box>
        </>
      ) : (
        <Box maw={620} mx={"auto"} bd="3px solid gray.6" p={rem(10)}>
          <Dropzone
            ref={dropzoneRef}
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

      <Button m={"2rem"}>
        <IconSend stroke={2} />
        登録
      </Button>
    </>
  );
};
