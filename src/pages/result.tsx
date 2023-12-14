import { Flex, Table, Title } from "@mantine/core";
import "./result.css";

type Team = { name: string; member: string[]; isWalk: boolean };
type Match = { teams: string[]; time: number[]; score: number[] };
//const matchType = GET.matchType;

const teams: Team[] = [
  { name: "特攻野郎Aチーム", member: ["Canada", "America"], isWalk: true },
  { name: "全力投球", member: ["マララ", "よしき"], isWalk: false },
  { name: "ハイパーチーム", member: ["ハイパー", "チーム"], isWalk: true },
  { name: "レンちゃん", member: ["レンちゃん", "リンちゃん"], isWalk: true },
  { name: "ももクロ", member: ["ももクロ", "人生"], isWalk: false },
  { name: "アベノミクス", member: ["アベノミクス", "ふみお"], isWalk: true },
];
const matches: Match[] = [
  { teams: [teams[0].name,teams[1].name], time: [120,300], score: [1, 2] },
  { teams: [teams[1].name,teams[2].name], time: [280,350], score: [1, 4] },
  { teams: [teams[2].name,teams[3].name], time: [350,30], score: [5, 2] },
];

export const Result = () => (
  <Flex direction="column" gap={20}>
    <FinalTable categoryName="本選" teams={teams} />
    <PrimaryTable categoryName="予選" matches={matches} />
  </Flex>
);

const FinalTable = (props: { categoryName: string; teams: Team[] }) => (
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
        {props.teams.map((element) => (
          <Table.Tr key={element.name}>
            <Table.Td className="td">{element.name}</Table.Td>
            <Table.Td className="td">{element.member.join(",")}</Table.Td>
            <Table.Td className="td">
              {element.isWalk ? "歩行" : "車輪"}
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </div>
);

const PrimaryTable = (props: { categoryName: string; matches: Match[] }) => (
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
          <Table.Tr key={element.teams[[0]]}>
            <Table.Td className="td">{element.teams[0]}</Table.Td>
            <Table.Td className="td">{element.time[0]}</Table.Td>
            <Table.Td className="td">{element.score[0]}</Table.Td>
            <Table.Td className="td">{element.teams[1]}</Table.Td>
            <Table.Td className="td">{element.time[1]}</Table.Td>
            <Table.Td className="td">{element.score[1]}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </div>
);
