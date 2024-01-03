import { Flex, Table, Title } from "@mantine/core";
import React, { useState, useEffect } from "react";
import "./result.css";

type MatchTeam = {
  left: {
    id: string;
    teamName: string;
    isMultiWalk: boolean;
    category: string;
  };
  right: {
    id: string;
    teamName: string;
    isMultiWalk: boolean;
    category: string;
  };
};
type Result = {
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
type Match = {
  id: string;
  teams: MatchTeam;
  matchType: string;
  courseIndex: number;
  results: Result;
};

export const Result = () => {
  const [primarymatch, setprimaryMatch] = useState<Match[]>([]);
  // ToDo: 本選の結果を取得する
  const [finalmatch, setfinalMatch] = useState<Match[]>([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/match/primary`)
      .then((res) => res.json())
      .then((json) => setprimaryMatch(json))
      .catch(() => alert("error"));
  }, []);

  return (
    <>
      <Flex direction="column" gap={20}>
        <FinalTable categoryName="本選" matches={primarymatch} />
        <PrimaryTable categoryName="予選" matches={primarymatch} />
      </Flex>
    </>
  );
};

function MatchResult(winner: string, loser: string, points: number[]) {
  return (
    <>
      <Table.Td className="td">{winner}</Table.Td>
      <Table.Td className="td">
        {points[0]}-{points[1]}
      </Table.Td>
      <Table.Td className="td">{loser}</Table.Td>
    </>
  );
}

const FinalTable = (props: { categoryName: string; matches: Match[] }) => (
  <div>
    <Title order={3}>{props.categoryName}</Title>
    <Table striped withTableBorder miw="40rem">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>勝ち</Table.Th>
          <Table.Th>得点</Table.Th>
          <Table.Th>負け</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {props.matches.map((element) => (
          <Table.Tr key={element.id}>
            {element.results?.left.points > element.results?.right.points
              ? MatchResult(
                  element.teams.left.teamName,
                  element.teams.right.teamName,
                  [element.results?.left.points, element.results?.right.points]
                )
              : MatchResult(
                  element.teams.right.teamName,
                  element.teams.left.teamName,
                  [element.results?.right.points, element.results?.left.points]
                )}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </div>
);

const PrimaryTable = (props: { categoryName: string; matches: Match[] }) => (
  <>
    <div>
      <Title order={3}>{props.categoryName}</Title>
      <Table striped withTableBorder miw="40rem">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>チーム1</Table.Th>
            <Table.Th>時間</Table.Th>
            <Table.Th>得点</Table.Th>
            <Table.Th>チーム2</Table.Th>
            <Table.Th>時間</Table.Th>
            <Table.Th>得点</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {props.matches.map((element) => (
            <Table.Tr key={element.id}>
              <Table.Td className="td">{element.teams?.left.teamName}</Table.Td>
              <Table.Td className="td">{element.results?.left.time}</Table.Td>
              <Table.Td className="td">{element.results?.left.points}</Table.Td>
              <Table.Td className="td">
                {element.teams?.right.teamName}
              </Table.Td>
              <Table.Td className="td">{element.results?.right.time}</Table.Td>
              <Table.Td className="td">
                {element.results?.right.points}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  </>
);
