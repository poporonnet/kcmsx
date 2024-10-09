import { Flex, Select, Table, Title } from "@mantine/core";
import { DepartmentType, config } from "config";
import { useEffect, useState } from "react";

type PreMatch = {
  id: string;
  matchCode: string;
  departmentType: DepartmentType;
  leftTeam: {
    id: string;
    teamName: string;
  };
  rightTeam: {
    id: string;
    teamName: string;
  };
  runResults: {
    id: string;
    teamID: string;
    points: number;
    goalTimeSeconds?: number;
    finishState: "goal" | "finished";
  }[];
};

type MainMatch = {
  id: string;
  matchCode: string;
  departmentType: DepartmentType;
  team1: {
    id: string;
    teamName: string;
  };
  team2: {
    id: string;
    teamName: string;
  };
  winnerID: string;
  runResults: {
    id: string;
    teamID: string;
    points: number;
    goalTimeSeconds?: number;
    finishState: "goal" | "finished";
  }[];
};

export const Result = () => {
  const [preMatchData, setPreMatchData] = useState<PreMatch[]>([]);
  const [mainMatchData, setMainMatchData] = useState<MainMatch[]>([]);
  const [department, setDepartment] = useState<DepartmentType>(
    config.departments[0].type
  );

  useEffect(() => {
    const getMatches = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/match`, {
        method: "GET",
      }).catch(() => undefined);

      const matchResponse = (await response?.json()) as
        | { pre: PreMatch[]; main: MainMatch[] }
        | undefined;

      console.log(matchResponse);

      setPreMatchData(
        matchResponse
          ? matchResponse.pre.filter(
              (match) => match.departmentType === department
            )
          : []
      );
      setMainMatchData(
        matchResponse
          ? matchResponse.main.filter(
              (match) => match.departmentType === department
            )
          : []
      );
    };
    getMatches();
  }, [department]);

  const teamData = new Map<string, string>();
  mainMatchData?.forEach((element) => {
    if (element.team1) teamData.set(element.team1.id, element.team1.teamName);
    if (element.team2) teamData.set(element.team2.id, element.team2.teamName);
  });

  return (
    <>
      <Select
        label="部門"
        data={config.departments.map((element) => ({
          value: element.type,
          label: element.name,
        }))}
        value={department}
        defaultValue={config.departments[0].type}
        onChange={(value) => value && setDepartment(value as DepartmentType)}
      />
      <Flex direction="column" gap={20}>
        <Title order={3}>{department}</Title>
        <MainResultTable
          departmentType={department}
          matches={mainMatchData}
          teamData={teamData}
        />
        <PreResultTable departmentType={department} matches={preMatchData} />
      </Flex>
    </>
  );
};

const PreResultTable = (props: {
  departmentType: DepartmentType | null;
  matches: PreMatch[] | [];
}) => {
  if (props.matches.length === 0) {
    return (
      <div>
        <Title order={3}>{"予選"}</Title>
        <p>結果がありません</p>
      </div>
    );
  }
  return (
    <div>
      <Title order={3}>{"予選"}</Title>
      <Table striped withTableBorder miw="40rem">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>左チーム</Table.Th>
            <Table.Th>得点</Table.Th>
            <Table.Th>時間</Table.Th>
            <Table.Th>右チーム</Table.Th>
            <Table.Th>得点</Table.Th>
            <Table.Th>時間</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {props.matches.map((element) => {
            return (
              <Table.Tr key={element.id}>
                <Table.Td className="td">
                  {element.leftTeam ? element.leftTeam.teamName : ""}
                </Table.Td>
                <Table.Td className="td">
                  {element.leftTeam
                    ? element.runResults.map((result) =>
                        result.teamID === element.leftTeam.id
                          ? result.points
                          : ""
                      )
                    : ""}
                </Table.Td>
                <Table.Td className="td">
                  {element.leftTeam
                    ? element.runResults.map((result) =>
                        result.teamID === element.leftTeam.id
                          ? (result.goalTimeSeconds ?? "リタイア")
                          : ""
                      )
                    : ""}
                </Table.Td>
                <Table.Td className="td">
                  {element.rightTeam ? element.rightTeam.teamName : ""}
                </Table.Td>
                <Table.Td className="td">
                  {element.rightTeam
                    ? element.runResults.map((result) =>
                        result.teamID === element.rightTeam.id
                          ? result.points
                          : ""
                      )
                    : ""}
                </Table.Td>
                <Table.Td className="td">
                  {element.rightTeam
                    ? element.runResults.map((result) =>
                        result.teamID === element.rightTeam.id
                          ? (result.goalTimeSeconds ?? "リタイア")
                          : ""
                      )
                    : ""}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </div>
  );
};

const MainResultTable = (props: {
  departmentType: DepartmentType | null;
  matches: MainMatch[] | [];
  teamData: Map<string, string>;
}) => {
  if (props.matches.length === 0) {
    return (
      <div>
        <Title order={3}>{"本戦"}</Title>
        <p>結果がありません</p>
      </div>
    );
  }
  return (
    <div>
      <Title order={3}>{"本戦"}</Title>
      <Table striped withTableBorder miw="40rem">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>勝ち</Table.Th>
            <Table.Th>得点</Table.Th>
            <Table.Th>負け</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {props.matches.map((element) => {
            return (
              <>
                <Table.Tr key={element.id}>
                  <Table.Td className="td">
                    {props.teamData.get(element.winnerID)}
                  </Table.Td>
                  <Table.Td className="td">
                    {element.runResults
                      .map((result) =>
                        result.teamID === element.winnerID ? result.points : 0
                      )
                      .reduce((sum, point) => sum + point, 0)}
                    -
                    {element.runResults
                      .map((result) =>
                        result.teamID !== element.winnerID ? result.points : 0
                      )
                      .reduce((sum, point) => sum + point, 0)}
                  </Table.Td>
                  <Table.Td className="td">
                    {props.teamData.get(
                      element.team1.id === element.winnerID
                        ? element.team2
                          ? element.team2.id
                          : ""
                        : element.team1.id
                    )}
                  </Table.Td>
                </Table.Tr>
              </>
            );
          })}
        </Table.Tbody>
      </Table>
    </div>
  );
};
