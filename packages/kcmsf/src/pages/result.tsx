import { Flex, Select, Table, Title } from "@mantine/core";
import { MatchType, config, pick } from "config";
import { useState } from "react";

import "./entryList.css";

type PreMatch = {
  id: string;
  matchCode: string;
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
  const [matchType, setMatchType] = useState<MatchType>("pre");
  const [department, setDepartment] = useState<string | null>(
    config.departments[0].name
  );

  //APIが修正されたら書く
  /*
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/match`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0 || data === undefined) return;
        if (matchType === "main") {
          setMainMatchData(data);
        } else {
          setPreMatchData(data);
        }
      });
  }, []);
  */

  return (
    <>
      <Select
        label="部門"
        data={pick(config.departments, "name")}
        value={department}
        defaultValue={config.departments[0].name}
        onChange={setDepartment}
      />
      <Flex direction="column" gap={20}>
        <Title order={3}>{department}</Title>
        <MainResultTable matchType={"本戦"} matches={mainMatchData} />
        <PreResultTable matchType={"予選"} matches={preMatchData} />
      </Flex>
    </>
  );
};

function MainResult(matches: MainMatch[]) {
  const [winner, setWinner] = useState<string>("");
  const [loser, setLoser] = useState<string>("");
  const [points, setPoints] = useState<number[]>([]);
  matches.map((element) => {
    if (element.winnerID === element.team1.id) {
      setWinner(element.team1.teamName);
      setLoser(element.team2.teamName);
    } else {
      setWinner(element.team2.teamName);
      setLoser(element.team1.teamName);
    }
    element.runResult.map((data) => {
      if (data.teamID === element.winnerID) {
        setPoints(
          points.map((point, index) => (index === 0 ? data.points : point))
        );
      } else {
        setPoints(
          points.map((point, index) => (index === 1 ? data.points : point))
        );
      }
    });
  });
  return (
    <>
      <Table.Td className="td">{winner}</Table.Td>
      <Table.Td className="td">
        {points[0]}-{points[1]}
      </Table.Td>
      <Table.Td className="td">{loser}</Table.Td>
    </>
  );
}

const PreResultTable = (props: { matchType: string; matches: PreMatch[] }) => {
  if (props.matches.length === 0) {
    return (
      <div>
        <Title order={3}>{props.matchType}</Title>
        <p>結果がありません</p>
      </div>
    );
  }
  return (
    <div>
      <Title order={3}>{props.matchType}</Title>
      <Table striped withTableBorder miw="40rem">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>左チーム</Table.Th>
            <Table.Th>時間</Table.Th>
            <Table.Th>得点</Table.Th>
            <Table.Th>右チーム</Table.Th>
            <Table.Th>時間</Table.Th>
            <Table.Th>得点</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {props.matches.map((element) => (
            <Table.Tr key={element.id}>
              <Table.Td className="td">{element.leftTeam.teamName}</Table.Td>
              <Table.Td className="td">
                {element.runResult.map((data) => {
                  if (data.id === element.leftTeam.id) return data.points;
                })}
              </Table.Td>
              <Table.Td className="td">
                {element.runResult.map((data) => {
                  if (
                    data.id === element.leftTeam.id &&
                    data.goalTimeSeconds !== null
                  ) {
                    return data.goalTimeSeconds;
                  } else {
                    return "リタイヤ";
                  }
                })}
              </Table.Td>
              <Table.Td className="td">{element.rightTeam.teamName}</Table.Td>
              <Table.Td className="td">
                {element.runResult.map((data) => {
                  if (data.id === element.rightTeam.id) return data.points;
                })}
              </Table.Td>
              <Table.Td className="td">
                {element.runResult.map((data) => {
                  if (
                    data.id === element.rightTeam.id &&
                    data.goalTimeSeconds !== null
                  ) {
                    return data.goalTimeSeconds;
                  } else {
                    return "リタイヤ";
                  }
                })}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};

const MainResultTable = (props: {
  matchType: string;
  matches: MainMatch[];
}) => {
  if (props.matches.length === 0) {
    return (
      <div>
        <Title order={3}>{props.matchType}</Title>
        <p>結果がありません</p>
      </div>
    );
  }
  return (
    <div>
      <Title order={3}>{props.matchType}</Title>
      <Table striped withTableBorder miw="40rem">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>勝ち</Table.Th>
            <Table.Th>得点</Table.Th>
            <Table.Th>負け</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{MainResult(props.matches)}</Table.Tbody>
      </Table>
    </div>
  );
};
