import { Stack, Title } from "@mantine/core";
import { config, MatchType } from "config";
import { useNavigate } from "react-router-dom";
import { DepartmentSegmentedControl } from "../components/DepartmentSegmentedControl";
import { TournamentBracket } from "../components/tournament/TournamentBracket";
import { useDepartmentTypeQuery } from "../hooks/useDepartmentTypeQuery";
import { Tournament as TournamentType } from "../types/tournament";

const tournamentSample: TournamentType = {
  type: "match",
  matchId: "match7",
  matchCode: "1-7",
  team1Id: "team4",
  team2Id: "team6",
  winnerId: "team4",
  previousNode1: {
    type: "match",
    matchId: "match5",
    matchCode: "1-5",
    team1Id: "team1",
    team2Id: "team4",
    winnerId: "team4",
    previousNode1: {
      type: "match",
      matchId: "match1",
      matchCode: "1-1",
      team1Id: "team1",
      team2Id: "team2",
      winnerId: "team1",
      previousNode1: { type: "team", teamId: "team1", teamName: "チーム1" },
      previousNode2: { type: "team", teamId: "team2", teamName: "チーム2" },
    },
    previousNode2: {
      type: "match",
      matchId: "match2",
      matchCode: "1-2",
      team1Id: "team3",
      team2Id: "team4",
      winnerId: "team4",
      previousNode1: { type: "team", teamId: "team3", teamName: "チーム3" },
      previousNode2: { type: "team", teamId: "team4", teamName: "チーム4" },
    },
  },
  previousNode2: {
    type: "match",
    matchId: "match6",
    matchCode: "1-6",
    team1Id: "team6",
    team2Id: "team7",
    winnerId: "team6",
    previousNode1: {
      type: "match",
      matchId: "match3",
      matchCode: "1-3",
      team1Id: "team5",
      team2Id: "team6",
      winnerId: "team6",
      previousNode1: { type: "team", teamId: "team5", teamName: "チーム5" },
      previousNode2: { type: "team", teamId: "team6", teamName: "チーム6" },
    },
    previousNode2: {
      type: "match",
      matchId: "match4",
      matchCode: "1-4",
      team1Id: "team7",
      team2Id: "team8",
      winnerId: "team7",
      previousNode1: { type: "team", teamId: "team7", teamName: "チーム7" },
      previousNode2: { type: "team", teamId: "team8", teamName: "チーム8" },
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
      <Title m="md">本選トーナメント</Title>
      <DepartmentSegmentedControl
        departmentType={departmentType}
        setDepartmentType={setDepartmentType}
      />
      <TournamentBracket
        tournament={tournamentSample}
        onClickNode={(node) => {
          if (node.attributes.type === "team") return;

          navigate(
            `/match/${"main" satisfies MatchType}/${node.attributes.matchId}`
          );
        }}
      />
    </Stack>
  );
};
