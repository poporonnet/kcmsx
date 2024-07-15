import { Flex, MantineColor } from "@mantine/core";
import { ruleList } from "../../config/rule/rule";
import { Team } from "../../utils/match/team";
import { parseSeconds } from "../../utils/time";
import { PointControl } from "./PointControl";

export const PointControls = (props: {
  color: MantineColor;
  team: Team;
  onChange: () => void;
  onGoal: (done: boolean) => void;
}) => {
  return (
    <Flex direction="column" gap="xs">
      {ruleList.map(
        (rule) =>
          !(
            "visible" in rule && !rule.visible(props.team.point.premiseState)
          ) && ( // このルールが非表示でない場合のみ
            <PointControl
              color={props.color}
              team={props.team}
              rule={rule}
              onChange={(value) => {
                props.onChange();
                if (rule.name === "goal" && typeof value === "boolean")
                  props.onGoal(value);
              }}
            >
              {rule.label}
              {rule.name === "goal" && props.team.goalTimeSeconds != null
                ? ` ${parseSeconds(props.team.goalTimeSeconds)}`
                : ""}
            </PointControl>
          )
      )}
    </Flex>
  );
};
