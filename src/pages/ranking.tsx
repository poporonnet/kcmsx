import { Flex, Table, Title } from "@mantine/core";
import "./ranking.css";

type Team = {
  name: string;
  point: number;
  time: number;
  isWalk: boolean;
};

const teams: Team[] = [
  { name: "特攻野郎Aチーム", point: 4, time: 300.0, isWalk: true },
  { name: "全力投球", point: 5, time: 260.0, isWalk: false },
  { name: "ハイパーチーム", point: 2, time: 310.0, isWalk: true },
  { name: "レンちゃん", point: 1, time: 350.0, isWalk: true },
  { name: "ももクロ", point: 7, time: 290.0, isWalk: false },
  { name: "アベノミクス", point: 4, time: 320.0, isWalk: true },
];

const ranking = teams.sort(function (a, b) {
  if (a.point == b.point) {
    return a.time > b.time ? 1 : -1;
  }
  return a.point > b.point ? -1 : 1;
});

export const Ranking = () => (
  <Flex direction="column" gap={20}>
    <h1>小学生部門</h1>
    <RankingTable categoryName="予選" teams={ranking} />
    <RankingTable categoryName="本戦" teams={ranking} />
    <h1>オープン部門</h1>
    <RankingTable categoryName="予選" teams={teams} />
    <RankingTable categoryName="本戦" teams={teams} />
  </Flex>
);

const RankingTable = (props: { categoryName: string; teams: Team[] }) => (
  <div>
    <Title order={3}>{props.categoryName}</Title>
    <Table striped withTableBorder miw="40rem">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>順位</Table.Th>
          <Table.Th>チーム名</Table.Th>
          <Table.Th>ポイント</Table.Th>
          <Table.Th>タイム</Table.Th>
          <Table.Th>タイプ</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {props.teams.map((element, index) => (
          <Table.Tr key={element.name}>
            <Table.Td className="td">{index + 1}</Table.Td>
            <Table.Td className="td">{element.name}</Table.Td>
            <Table.Td className="td">{element.point}</Table.Td>
            <Table.Td className="td">{element.time}</Table.Td>
            <Table.Td className="td">
              {element.isWalk ? "歩行" : "車輪"}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </div>
);
