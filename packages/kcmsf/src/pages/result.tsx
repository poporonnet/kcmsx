import { Flex, Table, Title } from "@mantine/core";
import { config } from "config";
import { useMemo } from "react";
import { DepartmentSegmentedControl } from "../components/DepartmentSegmentedControl";
import { LabeledSegmentedControls } from "../components/LabeledSegmentedControls";
import { useDepartmentTypeQuery } from "../hooks/useDepartmentTypeQuery";
import { useFetch } from "../hooks/useFetch";
import { GetMatchesResponse } from "../types/api/match";
import { MainMatch, PreMatch } from "../types/match";
import { parseSeconds } from "../utils/time";

export const Result = () => {
  const { data: matches } = useFetch<GetMatchesResponse>(
    `${import.meta.env.VITE_API_URL}/match`
  );
  const [departmentType, setDepartmentType] = useDepartmentTypeQuery(
    config.departments[0].type
  );

  const teamNames: Map<string, string> = useMemo(() => {
    const team = new Map<string, string>();
    matches?.main.forEach((element) => {
      if (element.team1) team.set(element.team1.id, element.team1.teamName);
      if (element.team2) team.set(element.team2.id, element.team2.teamName);
    });
    return team;
  }, [matches]);

  const preMatches = useMemo(
    () =>
      matches?.pre.filter((match) => match.departmentType === departmentType) ??
      [],
    [matches, departmentType]
  );

  const mainMatches = useMemo(
    () =>
      matches?.main.filter(
        (match) => match.departmentType === departmentType
      ) ?? [],
    [matches, departmentType]
  );

  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="center"
        gap="{20}"
        mb={"2rem"}
      >
        <LabeledSegmentedControls>
          <DepartmentSegmentedControl
            departmentType={departmentType}
            setDepartmentType={setDepartmentType}
          />
        </LabeledSegmentedControls>
      </Flex>
      <Flex direction="column" gap={20}>
        <Title order={3}>{config.department[departmentType].name}</Title>
        <MainResultTable matches={mainMatches} teamNames={teamNames} />
        <PreResultTable matches={preMatches} />
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
    props.match.winnerID !== ""
      ? props.match.team1?.id == props.match.winnerID
        ? (props.match.team2?.id ?? "")
        : (props.match.team1?.id ?? "")
      : "";

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
          .filter((result) => result.teamID === loserID)
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
            <Table.Th style={{ textAlign: "center" }}>ゴールタイム</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>右チーム</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>得点</Table.Th>
            <Table.Th style={{ textAlign: "center" }}>ゴールタイム</Table.Th>
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
        {leftResult
          ? leftResult.goalTimeSeconds === null
            ? "フィニッシュ"
            : parseSeconds(leftResult.goalTimeSeconds)
          : ""}
      </Table.Td>
      <Table.Td className="td">{props.match.rightTeam?.teamName}</Table.Td>
      <Table.Td className="td">{rightResult?.points}</Table.Td>
      <Table.Td className="td">
        {rightResult
          ? rightResult.goalTimeSeconds === null
            ? "フィニッシュ"
            : parseSeconds(rightResult.goalTimeSeconds)
          : ""}
      </Table.Td>
    </>
  );
};
