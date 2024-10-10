import { Flex, MantineColor } from "@mantine/core";
import { config } from "config";
import { Team } from "../../utils/match/team";
import { parseSeconds } from "../../utils/time";
import { PointControl } from "./PointControl";

export const PointControls = (props: {
  color: MantineColor;
  team: Team;
  onChange: () => void;
  onGoal: (done: boolean) => void;
  disabled?: boolean;
}) => {
  return (
    <Flex direction="column" gap="xs">
      {config.rules.map(
        (rule) =>
          !(
            "visible" in rule && !rule.visible?.(props.team.point.premiseState)
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
              key={`${props.team.point.premiseState.side}-${rule.name}`}
              disabled={props.disabled}
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
