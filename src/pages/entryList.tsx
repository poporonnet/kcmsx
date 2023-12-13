import { Flex, Table, Title } from "@mantine/core";
import "./entryList.css";

type Team = { name: string; member: string[]; isWalk: boolean };

const teams: Team[] = [
  { name: "特攻野郎Aチーム", member: ["Canada", "America"], isWalk: true },
  { name: "全力投球", member: ["マララ", "よしき"], isWalk: false },
  { name: "ハイパーチーム", member: ["ハイパー", "チーム"], isWalk: true },
  { name: "レンちゃん", member: ["レンちゃん", "リンちゃん"], isWalk: true },
  { name: "ももクロ", member: ["ももクロ", "人生"], isWalk: false },
  { name: "アベノミクス", member: ["アベノミクス", "ふみお"], isWalk: true },
];

export const EntryList = () => (
  <Flex direction="column" gap={20}>
    <EntryTable categoryName="小中学生部門" teams={teams} />
    <EntryTable categoryName="オープン部門" teams={teams} />
  </Flex>
);

const EntryTable = (props: { categoryName: string; teams: Team[] }) => (
  <div>
    <Title order={3}>{props.categoryName}</Title>
    <Table striped withTableBorder miw="40rem">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>チーム名</Table.Th>
          <Table.Th>メンバー</Table.Th>
          <Table.Th>タイプ</Table.Th>
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
