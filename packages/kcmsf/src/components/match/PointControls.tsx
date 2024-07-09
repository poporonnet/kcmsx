import { Flex, MantineColor } from "@mantine/core";
import { lang } from "../../config/lang/lang";
import { Team } from "../../utils/match/team";
import { parseSeconds } from "../../utils/time";
import { PointCountable } from "./PointCountable";
import { PointSingle } from "./PointSingle";

export const PointControls = (props: {
  color: MantineColor;
  team: Team;
  onChange: () => void;
  onGoal: (done: boolean) => void;
}) => {
  return (
    <Flex direction="column" gap="xs">
      <PointSingle
        color={props.color}
        onChange={(active) => {
          props.team.point.state.leaveBase = active;
          props.onChange();
        }}
      >
        {lang.match.leaveBase}
      </PointSingle>
      <PointSingle
        color={props.color}
        onChange={(active) => {
          props.team.point.state.overMiddle = active;
          props.onChange();
        }}
      >
        {lang.match.overMiddle}
      </PointSingle>
      <PointSingle
        color={props.color}
        onChange={(active) => {
          props.team.point.state.enterDestination = active;
          props.onChange();
        }}
      >
        {lang.match.enterDistination}
      </PointSingle>
      <PointSingle
        color={props.color}
        onChange={(active) => {
          props.team.point.state.placeBall = active;
          props.onChange();
        }}
      >
        {lang.match.placeBall}
      </PointSingle>
      <PointSingle
        color={props.color}
        onChange={(active) => {
          props.team.point.state.returnBase = active;
          props.onChange();
        }}
      >
        {lang.match.returnBase}
      </PointSingle>
      <PointSingle
        color={props.color}
        onChange={(done) => {
          props.team.point.state.goal = done;
          props.onGoal(done);
          props.onChange();
        }}
      >
        {lang.match.goal}{" "}
        {props.team.goalTimeSeconds != null &&
          parseSeconds(props.team.goalTimeSeconds)}
      </PointSingle>
      <PointCountable
        color={props.color}
        team={props.team}
        onChange={props.onChange}
      />
    </Flex>
  );
};
