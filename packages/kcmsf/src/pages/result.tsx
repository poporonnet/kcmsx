import { Flex, Select, Table, Title } from "@mantine/core";
import { DepartmentType, config } from "config";
import { useEffect, useMemo, useState } from "react";

type PreMatch = {
  id: string;
  matchCode: string;
  departmentType: DepartmentType;
  leftTeam?: {
    id: string;
    teamName: string;
  };
  rightTeam?: {
    id: string;
    teamName: string;
  };
  runResults: MatchResults;
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
  runResults: MatchResults;
};

type MatchResults = {
  id: string;
  teamID: string;
  points: number;
  goalTimeSeconds?: number;
  finishState: "goal" | "finished";
}[];

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

      setPreMatchData(matchResponse ? matchResponse.pre : []);
      setMainMatchData(matchResponse ? matchResponse.main : []);
    };
    getMatches();
  }, []);

  const teamNames: Map<string, string> = useMemo(() => {
    const team = new Map<string, string>();
    mainMatchData.forEach((element) => {
      if (element.team1) team.set(element.team1.id, element.team1.teamName);
      if (element.team2) team.set(element.team2.id, element.team2.teamName);
    });
    return team;
  }, [mainMatchData]);

  const preMatches = useMemo(
    () => mainMatchData.filter((match) => match.departmentType === department),
    [mainMatchData]
  );

  const mainMatches = useMemo(
    () => preMatchData.filter((match) => match.departmentType === department),
    [preMatchData]
  );

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
        <Title order={3}>{config.department[department].name}</Title>
        <MainResultTable matches={preMatches} teamNames={teamNames} />
        <PreResultTable matches={mainMatches} />
      </Flex>
    </>
  );
};

const MainResultTable = (props: {
  matches: MainMatch[];
  teamNames: Map<string, string>;
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
            <Table.Th style={{ textAlign: "center" }}>勝ち</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>得点</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>負け</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {props.matches.map((element) => (
            <Table.Tr key={element.id}>
              <MainMatchColum match={element} teamData={props.teamNames} />
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};

const MainMatchColum = (props: {
  match: MainMatch;
  teamData: Map<string, string>;
}) => {
  const loserID =
    props.match.winnerID === props.match.team1.id
      ? props.match.team2.id
      : props.match.team1.id;
  return (
    <>
      <Table.Td className="td">
        {props.teamData.get(props.match.winnerID)}
      </Table.Td>
      <Table.Td className="td">
        {props.match.runResults
          .filter((result) => result.teamID === props.match.winnerID)
          .reduce((sum, result) => sum + result.points, 0)}
        -
        {props.match.runResults
          .filter((result) => result.teamID !== props.match.winnerID)
          .reduce((sum, result) => sum + result.points, 0)}
      </Table.Td>
      <Table.Td className="td">{props.teamData.get(loserID)}</Table.Td>
    </>
  );
};

const PreResultTable = (props: { matches: PreMatch[] }) => {
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
            <Table.Th style={{ textAlign: "center" }}>左チーム</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>得点</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>時間</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>右チーム</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>得点</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>時間</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {props.matches.map((element) => (
            <Table.Tr key={element.id}>
              <PreResultColum match={element} />
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};

const PreResultColum = (props: { match: PreMatch }) => {
  const leftResult = useMemo(
    () =>
      props.match.runResults.find(
        (result) => result.teamID === props.match.leftTeam?.id
      ),
    [props.match]
  );
  const rightResult = useMemo(
    () =>
      props.match.runResults.find(
        (result) => result.teamID === props.match.rightTeam?.id
      ),
    [props.match]
  );
  return (
    <>
      <Table.Td className="td">{props.match.leftTeam?.teamName}</Table.Td>
      <Table.Td className="td">{leftResult?.points}</Table.Td>
      <Table.Td className="td">
        {props.match.leftTeam
          ? (leftResult?.goalTimeSeconds ?? "フィニッシュ")
          : ""}
      </Table.Td>
      <Table.Td className="td">{props.match.rightTeam?.teamName}</Table.Td>
      <Table.Td className="td">{rightResult?.points}</Table.Td>
      <Table.Td className="td">
        {props.match.rightTeam
          ? (rightResult?.goalTimeSeconds ?? "フィニッシュ")
          : ""}
      </Table.Td>
    </>
  );
};
