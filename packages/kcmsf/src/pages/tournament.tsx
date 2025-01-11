import { Stack, Title } from "@mantine/core";
import { config, MatchType } from "config";
import { useNavigate } from "react-router-dom";
import { DepartmentSegmentedControl } from "../components/DepartmentSegmentedControl";
import { LabeledSegmentedControls } from "../components/LabeledSegmentedControls";
import { TournamentBracket } from "../components/tournament/TournamentBracket";
import { useDepartmentTypeQuery } from "../hooks/useDepartmentTypeQuery";
import { Tournament as TournamentType } from "../types/tournament";

const tournamentSample: TournamentType = {
  id: "match7",
  matchCode: "1-7",
  matchType: "main",
  departmentType: config.departmentTypes[0],
  team1: { id: "team4", teamName: "チーム4" },
  team2: { id: "team6", teamName: "チーム6" },
  winnerID: "team4",
  childMatch1: {
    id: "match5",
    matchCode: "1-5",
    matchType: "main",
    departmentType: config.departmentTypes[0],
    team1: { id: "team1", teamName: "チーム1" },
    team2: { id: "team4", teamName: "チーム4" },
    winnerID: "team4",
    childMatch1: {
      id: "match1",
      matchCode: "1-1",
      matchType: "main",
      departmentType: config.departmentTypes[0],
      team1: { id: "team1", teamName: "チーム1" },
      team2: { id: "team2", teamName: "チーム2" },
      winnerID: "team1",
    },
    childMatch2: {
      id: "match2",
      matchCode: "1-2",
      matchType: "main",
      departmentType: config.departmentTypes[0],
      team1: { id: "team3", teamName: "チーム3" },
      team2: { id: "team4", teamName: "チーム4" },
      winnerID: "team4",
    },
  },
  childMatch2: {
    id: "match6",
    matchCode: "1-6",
    matchType: "main",
    departmentType: config.departmentTypes[0],
    team1: { id: "team6", teamName: "チーム6" },
    team2: { id: "team7", teamName: "チーム7" },
    winnerID: "team6",
    childMatch1: {
      id: "match3",
      matchCode: "1-3",
      matchType: "main",
      departmentType: config.departmentTypes[0],
      team1: { id: "team5", teamName: "チーム5" },
      team2: { id: "team6", teamName: "チーム6" },
      winnerID: "team6",
    },
    childMatch2: {
      id: "match4",
      matchCode: "1-4",
      matchType: "main",
      departmentType: config.departmentTypes[0],
      team1: { id: "team7", teamName: "チーム7" },
      team2: { id: "team8", teamName: "チーム8" },
      winnerID: "team7",
    },
  },
};

export const Tournament = () => {
  const [departmentType, setDepartmentType] = useDepartmentTypeQuery(
    config.departmentTypes[0]
  );
  const navigate = useNavigate();

  return (
    <Stack gap="md" flex={1} justify="center" align="center">
      <Title m="md">本戦トーナメント</Title>
      <LabeledSegmentedControls>
        <DepartmentSegmentedControl
          departmentType={departmentType}
          setDepartmentType={setDepartmentType}
        />
      </LabeledSegmentedControls>
      <TournamentBracket
        tournament={tournamentSample}
        onClickNode={(node) => {
          if (node.attributes.type === "team") return;

          navigate(
            `/match/${"main" satisfies MatchType}/${node.attributes.matchID}`
          );
        }}
      />
    </Stack>
  );
};
