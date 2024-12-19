import { Stack, Title } from "@mantine/core";
import { config, MatchType } from "config";
import { useNavigate } from "react-router-dom";
import { DepartmentSegmentedControl } from "../components/DepartmentSegmentedControl";
import { LabeledSegmentedControls } from "../components/LabeledSegmentedControls";
import { TournamentBracket } from "../components/tournament/TournamentBracket";
import { useDepartmentTypeQuery } from "../hooks/useDepartmentTypeQuery";
import { Tournament as TournamentType } from "../types/tournament";

const tournamentSample: TournamentType = {
  type: "match",
  matchID: "match7",
  matchCode: "1-7",
  team1ID: "team4",
  team2ID: "team6",
  winnerID: "team4",
  previousNode1: {
    type: "match",
    matchID: "match5",
    matchCode: "1-5",
    team1ID: "team1",
    team2ID: "team4",
    winnerID: "team4",
    previousNode1: {
      type: "match",
      matchID: "match1",
      matchCode: "1-1",
      team1ID: "team1",
      team2ID: "team2",
      winnerID: "team1",
      previousNode1: { type: "team", teamID: "team1", teamName: "チーム1" },
      previousNode2: { type: "team", teamID: "team2", teamName: "チーム2" },
    },
    previousNode2: {
      type: "match",
      matchID: "match2",
      matchCode: "1-2",
      team1ID: "team3",
      team2ID: "team4",
      winnerID: "team4",
      previousNode1: { type: "team", teamID: "team3", teamName: "チーム3" },
      previousNode2: { type: "team", teamID: "team4", teamName: "チーム4" },
    },
  },
  previousNode2: {
    type: "match",
    matchID: "match6",
    matchCode: "1-6",
    team1ID: "team6",
    team2ID: "team7",
    winnerID: "team6",
    previousNode1: {
      type: "match",
      matchID: "match3",
      matchCode: "1-3",
      team1ID: "team5",
      team2ID: "team6",
      winnerID: "team6",
      previousNode1: { type: "team", teamID: "team5", teamName: "チーム5" },
      previousNode2: { type: "team", teamID: "team6", teamName: "チーム6" },
    },
    previousNode2: {
      type: "match",
      matchID: "match4",
      matchCode: "1-4",
      team1ID: "team7",
      team2ID: "team8",
      winnerID: "team7",
      previousNode1: { type: "team", teamID: "team7", teamName: "チーム7" },
      previousNode2: { type: "team", teamID: "team8", teamName: "チーム8" },
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
