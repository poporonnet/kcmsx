import { Flex, Table, Title } from "@mantine/core";
import React, { useState, useEffect } from "react";
import "./result.css";
type MatchTeam = {
  id: string;
  teamName: string;
  isMultiWalk: boolean;
  category: string;
};
type Match = {
  id: string;
  teams: MatchTeam[];
  matchType: string;
  points: number[];
  courseIndex: number;
  time: number[];
  winnerID: string;
};

export const Result = () => {
  const [match, setMatch] = useState<Data[]>([]);
  useEffect(() => {
    {
      /*fetch("http://localhost:3000/match/primary")*/
    }
    fetch("http://localhost:3000/entry")
      .then((res) => res.json())
      .then((json) => setMatch(json))
      .catch(() => alert("error"));
  }, []);

  console.log(match);
  return (
    <>
      <Flex direction="column" gap={20}>
        <FinalTable categoryName="本選" teams={teams} matches={matches} />
        <PrimaryTable categoryName="予選" matches={matches} />
      </Flex>
    </>
  );
};
type Data = {
  id: string;
  teamName: string;
  members: string[];
  isMultiWalk: boolean;
  category: string;
};
type Team = {
  id: string;
  teamName: string;
  member: string[];
  isMultiWalk: boolean;
  category: string;
};

const teams: Team[] = [
  {
    id: "1",
    teamName: "特攻野郎Aチーム",
    member: ["Canada", "America"],
    isMultiWalk: true,
    category: "Primary",
  },
  {
    id: "2",
    teamName: "全力投球",
    member: ["マララ", "よしき"],
    isMultiWalk: false,
    category: "Primary",
  },
  {
    id: "3",
    teamName: "ハイパーチーム",
    member: ["ハイパー", "チーム"],
    isMultiWalk: true,
    category: "Primary",
  },
  {
    id: "4",
    teamName: "レンちゃん",
    member: ["レンちゃん", "リンちゃん"],
    isMultiWalk: true,
    category: "Primary",
  },
  {
    id: "5",
    teamName: "ももクロ",
    member: ["ももクロ", "人生"],
    isMultiWalk: false,
    category: "Primary",
  },
  {
    id: "6",
    teamName: "アベノミクス",
    member: ["アベノミクス", "ふみお"],
    isMultiWalk: true,
    category: "Primary",
  },
];
const matches: Match[] = [
  {
    id: "39440930485092",
    teams: [
      {
        id: "39440930485098",
        teamName: "千葉ロッテ",
        isMultiWalk: false,
        category: "Primary",
      },
      {
        id: "93454093",
        teamName: "阪神タイガース",
        isMultiWalk: false,
        category: "Primary",
      },
    ],
    matchType: "Primary",
    points: [5, 3],
    courseIndex: 1,
    time: [100, 120],
    winnerID: "39440930485098",
  },
];

const FinalTable = (props: {
  categoryName: string;
  teams: Team[];
  matches: Match[];
}) => (
  <div>
    {}
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
          <Table.Tr key={element.id[0]}>
            <Table.Td className="td">{element.teams[0].teamName}</Table.Td>
            <Table.Td className="td">{element.points.join("-")}</Table.Td>
            <Table.Td className="td">{element.teams[1].teamName}</Table.Td>
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
            <Table.Tr key={element.id[0]}>
              <Table.Td className="td">{element.teams[0].teamName}</Table.Td>
              <Table.Td className="td">{element.time[0]}</Table.Td>
              <Table.Td className="td">{element.points[0]}</Table.Td>
              <Table.Td className="td">{element.teams[1].teamName}</Table.Td>
              <Table.Td className="td">{element.time[1]}</Table.Td>
              <Table.Td className="td">{element.points[1]}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  </>
);
