import { useState, useEffect } from "react";
import { Flex, Table, Title } from "@mantine/core";
import "./ranking.css";

type Ranking = {
  name: string;
  id: string;
  point: any;
  time: number;
};

const teams: Ranking[] = [
  { name: "特攻野郎Aチーム", id: "1", point: 4, time: 300 },
  { name: "全力投球", id: "2", point: 5, time: 260.0 },
  { name: "ハイパーチーム", id: "3", point: 2, time: 310.0 },
  { name: "レンちゃん", id: "4", point: 1, time: 350.0 },
  { name: "ももクロ", id: "5", point: 7, time: 290.0 },
  { name: "バカ", id: "6", point: 4, time: 320.0 },
  { name: "test", id: "7", point: 1, time: 900 },
];

const ranking = teams.sort(function (a, b) {
  if (a.point == b.point) {
    return a.time > b.time ? 1 : -1;
  }
  return a.point > b.point ? -1 : 1;
});

let rankdata: Ranking[] = [];

const FetchData = () => {
  let rankdata: Ranking[] = [];
  const [resultdata, setData] = useState();
  useEffect(() => {
    fetch("http://localhost:3000/match/primary", { method: "GET" })
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => alert("error"));
  }, []);

  if (resultdata != undefined) {
    resultdata.map((game) => {
      if (`results` in game) {
        Object.keys(game.results).map((elm) => {
          const tmp = { name: "str", id: "0", point: 0, time: 0 };
          if (elm == "left") {
            tmp.name = game.teams.left.teamName;
            tmp.id = game.results.left.teamID;
            tmp.point = game.results.left.points;
            tmp.time = game.results.left.time;
            rankdata.push(tmp);
          } else if (elm == "right") {
            tmp.name = game.teams.right.teamName;
            tmp.id = game.results.right.teamID;
            tmp.point = game.results.right.points;
            tmp.time = game.results.right.time;
            rankdata.push(tmp);
          }
        });
      }
    });
  }

  console.log("rank", rankdata);
  return (
    <>
      <div>test</div>
    </>
  );
};

export const Ranking = () => (
  <Flex direction="column" gap={20}>
    <FetchData />
    <h1>ランキング</h1>
    <h2>小学生部門</h2>
    <RankingTable categoryName="予選" teams={rankdata} />
  </Flex>
);

const RankingTable = (props: { categoryName: string; teams: Ranking[] }) => (
  <div>
    <Title order={3}>{props.categoryName}</Title>
    <Table striped withTableBorder miw="40rem">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>順位</Table.Th>
          <Table.Th>チーム名</Table.Th>
          <Table.Th>ポイント</Table.Th>
          <Table.Th>タイム</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {props.teams.map((element, index) => (
          <Table.Tr key={element.name}>
            <Table.Td className="td">{index + 1}</Table.Td>
            <Table.Td className="td">{element.name}</Table.Td>
            <Table.Td className="td">{element.point}</Table.Td>
            <Table.Td className="td">{element.time}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </div>
);
