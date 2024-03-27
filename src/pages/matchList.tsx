import { Center, Flex, Table, Text, Title } from "@mantine/core";
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
  useEffect(() => {
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
  }, [primaryMatches]);

  return (
    <>
      <Title order={1} m="1rem">
        試合表
      </Title>
      <Flex justify="flex-end" mb={"1rem"}>
        <CourseSelector courses={courses} selector={setSelect}/>
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
          {primaryMatches
            ? primaryMatches.map(
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
              )
            : null}
        </Table.Tbody>
      </Table>
    </>
  );
};
