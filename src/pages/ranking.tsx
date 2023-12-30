import { useState, useEffect } from "react";
import { Flex, Table, Title } from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import "./ranking.css";

type Ranking = {
  name: string;
  id: string;
  point: any;
  time: number;
};

let rankdata: Ranking[] = [];

const FetchData = () => {
  rankdata = [];
  const [resultdata, setData] = useState();
  useEffect(() => {
    fetch("http://localhost:3000/match/primary", { method: "GET" })
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => alert("error"));
  }, []);

  if (resultdata != undefined) {
    resultdata.map((match) => {
      if (match.results && match.matchType == "primary") {
        Object.keys(match.results).map((LtRt) => {
          const tmp = { name: "str", id: "0", point: 0, time: 0 };
          tmp.name = match.teams[LtRt].teamName;
          tmp.id = match.results[LtRt].teamID;
          rankdata.map((elm) => {
            if (elm.id == tmp.id) {
              tmp.point = match.results[LtRt].points + elm.point;
              tmp.time = match.results[LtRt].time + elm.time;
              rankdata = rankdata.filter((result) => result.id !== elm.id);
            }
          });
          if (!tmp.point) {
            tmp.point = match.results[LtRt].points;
            tmp.time = match.results[LtRt].time;
          }
          rankdata.push(tmp);
        });
      }
    });
  }

  rankdata = rankdata.sort(function (a, b) {
    if (a.point == b.point) {
      return a.time > b.time ? 1 : -1;
    }
    return a.point > b.point ? -1 : 1;
  });

  useInterval(FetchData, 30_00);

  return;
};

export const Ranking = () => (
  <Flex direction="column" gap={20}>
    <FetchData />
    <h1>ランキング</h1>
    <h2>小学生部門</h2>
    <RankingTable categoryName="予選" ranking={rankdata} />
  </Flex>
);

const RankingTable = (props: { categoryName: string; ranking: Ranking[] }) => (
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
        {props.ranking.map((element, index) => (
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
