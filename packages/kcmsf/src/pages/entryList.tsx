import { Flex, Table, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import "./entryList.css";
type Team = {
  id: string;
  teamName: string;
  members: string[];
  isMultiWalk: boolean;
  category: "Elementary" | "Open";
};
export const EntryList = () => {
  const [elementaryTeams, setElementaryTeams] = useState<[]>([]);
  const [openTeams, setOpenTeams] = useState<[]>([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/entry`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0 || data === undefined) return;
        const elementaryData = data.filter(
          (entry: Team) => entry.category === "Elementary"
        );
        setElementaryTeams(elementaryData);
        const openData = data.filter(
          (entry: Team) => entry.category === "Open"
        );
        setOpenTeams(openData);
      });
  }, []);

  return (
    <Flex direction="column" gap={20}>
      <EntryTable categoryName="小学生の部" teams={elementaryTeams} />
      <EntryTable categoryName="オープン部門" teams={openTeams} />
    </Flex>
  );
};

const EntryTable = (props: { categoryName: string; teams: Team[] }) => {
  if (props.teams.length === 0) {
    return (
      <div>
        <Title order={3}>{props.categoryName}</Title>
        <p>エントリーがありません</p>
      </div>
    );
  }
  return (
    <div>
      <Title order={3}>{props.categoryName}</Title>
      <Table striped withTableBorder miw="40rem">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>チーム名</Table.Th>
            <Table.Th>タイプ</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {props.teams.map((element) => (
            <Table.Tr key={element.id}>
              <Table.Td className="td">{element.teamName}</Table.Td>
              <Table.Td className="td">
                {element.isMultiWalk ? "歩行" : "車輪"}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};
