import {
  Button,
  Center,
  Flex,
  Loader,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { CourseSelector } from "../components/courseSelector";
import { MatchStatusButton } from "../components/matchStatus";
import { TeamInfo } from "./match";
type Match = {
  id: string;
  courseIndex: number;
  category: "elementary" | "open";
  teams: { right: TeamInfo; left: TeamInfo };
  matchType: "primary" | "final";
  results?: {
    left: {
      teamID: string;
      points: number;
      time: number;
    };
    right: {
      teamID: string;
      points: number;
      time: number;
    };
  };
};

export const MatchList = () => {
  const [primaryMatches, setPrimaryMatches] = useState<Match[] | undefined>();
  const [courses, setCourses] = useState<number[]>([]);
  const [select, setSelect] = useState<number | "all">("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const load = () => {
    if (loading) return;
    setError(false);
    setLoading(true);
    try {
      fetch(`${import.meta.env.VITE_API_URL}/match/primary`, { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          if (data.length === 0) return;
          setPrimaryMatches(data);
          if (primaryMatches) {
            let course = primaryMatches.map(
              (primaryMatches) => primaryMatches.courseIndex
            );
            course = [...new Set(course)];
            setCourses(course);
          }
        });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  });

  return (
    <>
      <Title order={1} m="1rem">
        試合表
      </Title>
      {primaryMatches ? (
        <>
          <Flex justify="flex-end" mb={"1rem"}>
            <CourseSelector courses={courses} selector={setSelect} />
          </Flex>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>コート番号</Table.Th>
                <Table.Th>左コート</Table.Th>
                <Table.Th>右コート</Table.Th>
                <Table.Th>
                  <Center>状態</Center>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {primaryMatches.map(
                (match) =>
                  (select === "all" || match.courseIndex === select) && (
                    <Table.Tr key={match.id}>
                      <Table.Td>
                        <Center miw={50}>
                          <Text fw={700}>{match.courseIndex}</Text>
                        </Center>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={700} miw={200} ta={"start"}>
                          {match.teams.left.teamName}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={700} miw={200} ta={"start"}>
                          {match.teams.right.teamName}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Center>
                          <MatchStatusButton
                            status={match.results ? "end" : "future"}
                            id={match.id}
                            teams={match.teams}
                            matchType={match.matchType}
                          />
                        </Center>
                      </Table.Td>
                    </Table.Tr>
                  )
              )}
            </Table.Tbody>
          </Table>
        </>
      ) : loading ? (
        <>
          <Text>ロード中</Text>
          <Loader size={40} />
        </>
      ) : error ? (
        <>
          <Text>現在試合はありません。</Text>
          <Button m={"2rem"} onClick={load}>
            <IconRefresh stroke={2} />
            再読み込み
          </Button>
        </>
      ) : (
        <>
          <Text c={"red"} fw={700}>
            サバーからのフェッチに失敗しました。
          </Text>
          <Button mt={"2rem"} onClick={load}>
            <IconRefresh stroke={2} />
            再読み込み
          </Button>
        </>
      )}
    </>
  );
};
