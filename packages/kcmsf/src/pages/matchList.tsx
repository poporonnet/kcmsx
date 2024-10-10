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
import { Match } from "../types/match";

export const MatchList = () => {
  const [preMatches, setPreMatches] = useState<Match[]>([]);
  const [courses, setCourses] = useState<number[]>([]);
  const [select, setSelect] = useState<number | "all">("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const fetchPre = async () => {
    setError(false);
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/match/pre`, {
        method: "GET",
      });

      const data = (await res.json()) as undefined | Match[];

      if (!data) {
        setError(true);
        setLoading(false);
        return;
      }

      if (data.length === 0) {
        setError(false);
        setLoading(false);
        console.log("No data");
        return;
      }

      setPreMatches(data);

      if (data) {
        const courses: number[] = [
          ...new Set(
            data.map((match: Match) => Number(match.matchCode.split("-")[0]))
          ),
        ];
        setCourses(courses);
      }

      setLoading(false);
    } catch {
      setError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPre();
  }, []);

  return (
    <>
      <Title order={1} m="1rem">
        試合表
      </Title>
      {preMatches.length > 0 && (
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
              {preMatches.map((match) => {
                const courseIndex = Number(match.matchCode.split("-")[0]);
                return (
                  (select === "all" || courseIndex === select) && (
                    <Table.Tr key={match.id}>
                      <Table.Td>
                        <Center miw={50}>
                          <Text fw={700}>{courseIndex}</Text>
                        </Center>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={700} miw={200} ta={"start"}>
                          {match.leftTeam?.teamName ?? ""}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={700} miw={200} ta={"start"}>
                          {match.rightTeam?.teamName ?? ""}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Center>
                          <MatchStatusButton
                            status={
                              match.runResults.length === 2 ? "end" : "future"
                            }
                            id={match.id}
                            matchType={"pre"}
                          />
                        </Center>
                      </Table.Td>
                    </Table.Tr>
                  )
                );
              })}
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
          <Button m={"2rem"} onClick={fetchPre}>
            <IconRefresh stroke={2} />
            再読み込み
          </Button>
        </>
      )}
    </>
  );
};
