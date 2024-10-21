import {
  Button,
  Center,
  Flex,
  List,
  Loader,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconRefresh } from "@tabler/icons-react";
import { config, DepartmentType, MatchType } from "config";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CourseSelector } from "../components/courseSelector";
import { GenerateMatchButton } from "../components/GenerateMatchButton";
import { MatchStatusButton } from "../components/matchStatus";
import { Match, PreMatch } from "../types/match";

export const MatchList = () => {
  const [preMatches, setPreMatches] = useState<PreMatch[]>([]);
  const [courses, setCourses] = useState<number[]>([]);
  const [select, setSelect] = useState<number | "all">("all");
  const [loading, { open: startLoading, close: finishLoading }] =
    useDisclosure(false);
  const [error, setError] = useState<boolean>(false);
  const processedPreMatches = useMemo(
    () =>
      select == "all"
        ? preMatches
        : preMatches.filter(
            (match) => Number(match.matchCode.split("-")[0]) == select
          ),
    [preMatches, select]
  );

  const fetchPre = useCallback(async () => {
    setError(false);
    startLoading();

    const res = await fetch(`${import.meta.env.VITE_API_URL}/match/pre`, {
      method: "GET",
    }).catch(() => undefined);

    if (!res?.ok) {
      setError(true);
      finishLoading();
      return;
    }

    const data = (await res.json()) as PreMatch[];

    setPreMatches(data);
    setCourses([
      ...new Set(
        data.map((match: Match) => Number(match.matchCode.split("-")[0]))
      ),
    ]);

    finishLoading();
  }, [startLoading, finishLoading]);

  const generateMatch = useCallback(
    async (matchType: MatchType, departmentType: DepartmentType) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/match/${matchType}/${departmentType}/generate`,
        {
          method: "POST",
        }
      ).catch(() => undefined);

      const isSucceeded = !!res?.ok;

      notifications.show({
        title: `試合表生成${isSucceeded ? "成功" : "失敗"}`,
        message: `${config.department[departmentType].name}・${config.match[matchType].name}の試合表を生成${isSucceeded ? "しました" : "できませんでした"}`,
        color: isSucceeded ? "green" : "red",
      });
    },
    []
  );

  useEffect(() => {
    fetchPre();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      gap="md"
      w="fit-content"
      mx="auto"
    >
      <Title order={1} m="1rem">
        試合表
      </Title>
      {preMatches.length > 0 && (
        <>
          <Flex w="100%" justify="right">
            <CourseSelector courses={courses} selector={setSelect} />
          </Flex>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>試合番号</Table.Th>
                <Table.Th>コート番号</Table.Th>
                <Table.Th>左コート</Table.Th>
                <Table.Th>右コート</Table.Th>
                <Table.Th>
                  <Center>状態</Center>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {processedPreMatches.map((match) => (
                <PreMatchRow match={match} key={match.id} />
              ))}
            </Table.Tbody>
          </Table>
        </>
      )}
      {loading && (
        <>
          <Text>ロード中</Text>
          <Loader size={40} />
        </>
      )}
      {error && (
        <>
          <Text c={"red"} fw={700}>
            サーバーからのフェッチに失敗しました。
          </Text>
          <Button mt={"2rem"} onClick={fetchPre}>
            <IconRefresh stroke={2} />
            再読み込み
          </Button>
        </>
      )}
      {preMatches.length === 0 && !loading && !error && (
        <>
          <Text>現在試合はありません。</Text>
          <GenerateMatchButton
            generate={async () => {
              await Promise.all(
                config.departmentTypes.map((departmentType) =>
                  generateMatch("pre", departmentType)
                )
              );
              fetchPre();
            }}
            modalTitle="予選試合表生成確認"
            modalDetail={
              <>
                以下の試合表を生成します:
                <List withPadding>
                  {config.departmentTypes.map((departmentType) => (
                    <List.Item key={departmentType}>
                      {config.match.pre.name}&emsp;
                      {config.department[departmentType].name}
                    </List.Item>
                  ))}
                </List>
              </>
            }
          />
        </>
      )}
    </Flex>
  );
};

const PreMatchRow = ({ match }: { match: PreMatch }) => (
  <Table.Tr key={match.id}>
    <Table.Td>
      <Center miw={50}>
        <Text fw={700}>{match.matchCode}</Text>
      </Center>
    </Table.Td>
    <Table.Td>
      <Center miw={50}>
        <Text fw={700}>{Number(match.matchCode.split("-")[0])}</Text>
      </Center>
    </Table.Td>
    <Table.Td>
      <Text fw={700} miw={200} ta="start">
        {match.leftTeam?.teamName}
      </Text>
    </Table.Td>
    <Table.Td>
      <Text fw={700} miw={200} ta="start">
        {match.rightTeam?.teamName}
      </Text>
    </Table.Td>
    <Table.Td>
      <Center>
        <MatchStatusButton
          status={match.runResults.length === 2 ? "end" : "future"}
          id={match.id}
          matchType="pre"
        />
      </Center>
    </Table.Td>
  </Table.Tr>
);
