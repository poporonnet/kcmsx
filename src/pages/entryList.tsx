import { Space, Table, Title } from "@mantine/core";
import "./entryList.css";
const elements = [
  { name: "特攻野郎Aチーム", member: ["Canada", "America"], isWalk: true },
  { name: "全力投球", member: ["マララ", "よしき"], isWalk: false },
  { name: "ハイパーチーム", member: ["ハイパー", "チーム"], isWalk: true },
  { name: "レンちゃん", member: ["レンちゃん", "リンちゃん"], isWalk: true },
  { name: "ももクロ", member: ["ももクロ", "人生"], isWalk: false },
  { name: "アベノミクス", member: ["アベノミクス", "ふみお"], isWalk: true },
];
export const EntryList = () => {
  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td className={"td"}>{element.name}</Table.Td>
      <Table.Td className={"td"}>{element.member.join(",")}</Table.Td>
      <Table.Td className={"td"}>{element.isWalk ? "歩行" : "車輪"}</Table.Td>
    </Table.Tr>
  ));
  return (
    <div>
      <Title order={3}>小中学生部門</Title>
      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>チーム名</Table.Th>
            <Table.Th>メンバー</Table.Th>
            <Table.Th>タイプ</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Space h={20} />
      <Title order={3}>オープン部門</Title>
      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>チーム名</Table.Th>
            <Table.Th>メンバー</Table.Th>
            <Table.Th>タイプ</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
};
