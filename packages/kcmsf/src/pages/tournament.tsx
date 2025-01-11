import { Stack, Title } from "@mantine/core";
import { config, MatchType } from "config";
import { useNavigate } from "react-router-dom";
import { DepartmentSegmentedControl } from "../components/DepartmentSegmentedControl";
import { LabeledSegmentedControls } from "../components/LabeledSegmentedControls";
import { TournamentBracket } from "../components/tournament/TournamentBracket";
import { useDepartmentTypeQuery } from "../hooks/useDepartmentTypeQuery";
import { useFetch } from "../hooks/useFetch";
import { GetTournament } from "../types/api/match";

export const Tournament = () => {
  const [departmentType, setDepartmentType] = useDepartmentTypeQuery(
    config.departmentTypes[0]
  );
  const { data: tournament } = useFetch<GetTournament>(
    `${import.meta.env.VITE_API_URL}/match/main/${departmentType}/tournament`
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
        tournament={tournament}
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
