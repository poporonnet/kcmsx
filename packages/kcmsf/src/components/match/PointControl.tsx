import { MantineColor } from "@mantine/core";
import { Rule } from "config";
import { Team } from "../../utils/match/team";
import { PointCountable } from "./PointCountable";
import { PointSingle } from "./PointSingle";

interface Props {
  color: MantineColor;
  team: Team;
  rule: Rule;
  onChange: (value: Parameters<Rule["point"]>[0]) => void;
  children: React.ReactNode;
  disabled?: boolean;
  unclickable?: boolean;
}

export const PointControl = (props: Props) => (
  <>
    {props.rule.type === "single" && (
      <PointSingle
        value={props.team.point.state[props.rule.name]}
        color={props.color}
        onChange={(active) => {
          if (props.unclickable) return;
          if (props.rule.type !== "single") return; // type narrowing

          props.team.point.state[props.rule.name] = active;
          props.onChange(active);
        }}
        disabled={
          props.disabled ||
          !(props.rule.changeable?.(props.team.point.premiseState) ?? true)
        }
      >
        {props.children}
      </PointSingle>
    )}
    {props.rule.type === "countable" && (
      <PointCountable
        value={props.team.point.state[props.rule.name]}
        color={props.color}
        validate={props.rule.validate}
        onChange={(count) => {
          if (props.unclickable) return;
          if (props.rule.type !== "countable") return; // type narrowing

          props.team.point.state[props.rule.name] = count;
          props.onChange(count);
        }}
        disabled={
          props.disabled ||
          !(props.rule.changeable?.(props.team.point.premiseState) ?? true)
        }
      >
        {props.children}
      </PointCountable>
    )}
  </>
);
