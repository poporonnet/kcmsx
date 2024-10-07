import { Flex, Select, Table, Title } from "@mantine/core";
import { DepartmentType, config, pick } from "config";
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
  runResult: [
    {
      id: string;
      teamID: string;
      points: number;
      goalTimeSeconds: number | null;
      finishState: "goal" | "finished";
    },
  ];
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
  runResult: [
    {
      id: string;
      teamID: string;
      points: number;
      goalTimeSeconds: number | null;
      finishState: "goal" | "finished";
    },
  ];
};

export const Result = () => {
  const [preMatchData, setPreMatchData] = useState<PreMatch[]>([]);
  const [mainMatchData, setMainMatchData] = useState<MainMatch[]>([]);
  //const [matchType, setMatchType] = useState<MatchType>("pre");
  const [department, setDepartment] = useState<string | null>(
    config.departments[0].name
  );

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/match`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.length === 0 || data === undefined) return;
        setMainMatchData(data.main);
        setPreMatchData(data.pre);
      });
  }, []);

  return (
    <>
      <Select
        label="部門"
        data={pick(config.departments, "name")}
        value={department}
        defaultValue={config.departments[0].type}
        onChange={setDepartment}
      />
      <Flex direction="column" gap={20}>
        <Title order={3}>{department}</Title>
        <MainResultTable
          departmentType={department}
          matches={mainMatchData}
        />
        <PreResultTable departmentType={department} matches={preMatchData} />
      </Flex>
    </>
  );
};

const departmentNameToType = (
  departmentName: string | null
): DepartmentType | undefined => {
  const department = config.departments.find(
    (element) => departmentName === element.name
  );
  return department ? department.type : undefined;
};

const PreResult = (
  departmentType: DepartmentType | undefined,
  match: PreMatch
) => {
  const [leftPoint, setLeftPoint] = useState<number>(0);
  const [rightPoint, setRightPoint] = useState<number>(0);
  const [leftGoalSeconds, setLeftGoalSeconds] = useState<number | null>(null);
  const [rightGoalSeconds, setRightGoalSeconds] = useState<number | null>(null);
  if (departmentType === match.departmentType) {
    match.runResult.map((data) => {
      if (data.id === match.leftTeam.id) {
        setLeftPoint(data.points);
        setLeftGoalSeconds(data.goalTimeSeconds);
      }
      if (data.id === match.rightTeam.id) {
        setRightPoint(data.points);
        setRightGoalSeconds(data.goalTimeSeconds);
      }
    });
  }
  return (
    <>
      <Table.Td className="td">{match.leftTeam ? match.leftTeam.teamName : undefined}</Table.Td>
      <Table.Td className="td">{leftPoint}</Table.Td>
      <Table.Td className="td">
        {leftGoalSeconds ? leftGoalSeconds : "リタイア"}
      </Table.Td>
      <Table.Td className="td">{match.rightTeam ? match.rightTeam.teamName: undefined}</Table.Td>
      <Table.Td className="td">{rightPoint}</Table.Td>
      <Table.Td className="td">
        {rightGoalSeconds ? rightGoalSeconds : "リタイア"}
      </Table.Td>
    </>
  );
};

const PreResultTable = (props: {
  departmentType: string | null;
  matches: PreMatch[];
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
          {props.matches.map((element) => (
            <Table.Tr key={element.id}>
              {PreResult(departmentNameToType(props.departmentType), element)}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};

const MainResult = (departmentType: DepartmentType | undefined, match: MainMatch) => {
  const [winner, setWinner] = useState<string>("");
  const [loser, setLoser] = useState<string>("");
  const [points, setPoints] = useState<number[]>([]);
  if (departmentType === match.departmentType) {
    if (match.winnerID === match.team1.id) {
      setWinner(match.team1.teamName);
      setLoser(match.team2.teamName);
    } else {
      setWinner(match.team2.teamName);
      setLoser(match.team1.teamName);
    }
    match.runResult.map((data) => {
      if (data.teamID === match.winnerID) {
        setPoints(
          points.map((point, index) => (index === 0 ? data.points : point))
        );
      } else {
        setPoints(
          points.map((point, index) => (index === 1 ? data.points : point))
        );
      }
    });
  }
  return (
    <>
      <Table.Td className="td">{winner}</Table.Td>
      <Table.Td className="td">
        {points[0]}-{points[1]}
      </Table.Td>
      <Table.Td className="td">{loser}</Table.Td>
    </>
  );
};

const MainResultTable = (props: {
  departmentType: string | null;
  matches: MainMatch[];
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
          {props.matches.map((element) => (
            <Table.Tr key={element.id}>
              {MainResult(departmentNameToType(props.departmentType), element)}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};
