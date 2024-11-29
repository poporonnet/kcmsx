import { Code, Paper, Table, Text, Title } from "@mantine/core";
import { config } from "config";
const csvDescription = {
  name: "1文字以上。重複できない。",
  member1: "3文字以上。",
  member2: "3文字以上。1人の場合は空欄。",
  robotType: config.robotTypes.join("または"),
  departmentType: config.departmentTypes.join("または"),
  clubName: "所属していなければ空欄。",
};

export const CsvExample = () => {
  const sampleCsv = `name,member1,member2,robotType,departmentType,clubName 
はなびらちーむ,さくら,あおい,leg,elementary,Rubyクラブ
優勝するぞ,ちひろ,,${config.robotTypes[0]},elementary,
ひまわり,ゆうた,ゆうと,leg,${config.departmentTypes[0]},`;
  return (
    <Paper p="xl" mt={16}>
      <Title order={3}>CSVの形式</Title>

      <Table mb={10} striped withTableBorder horizontalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th ta="center">カラム名</Table.Th>
            <Table.Th ta="center">制約</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Object.entries(csvDescription).map(([key, value]) => (
            <Table.Tr key={key}>
              <Table.Td ta="center">
                <Text>{key}</Text>
              </Table.Td>
              <Table.Td ta="left">
                <Text>{value}</Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Title order={3}>CSVの例</Title>
      <Code block ta={"left"}>
        {sampleCsv}
      </Code>
    </Paper>
  );
};
