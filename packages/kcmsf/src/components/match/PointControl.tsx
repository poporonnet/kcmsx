import { MantineColor } from "@mantine/core";
import { Rule, StateTypes } from "../../config/types/rule";
import { Team } from "../../utils/match/team";
import { PointCountable } from "./PointCountable";
import { PointSingle } from "./PointSingle";

interface Props {
  color: MantineColor;
  team: Team;
  rule: Rule;
  onChange: (value: StateTypes) => void;
  children: React.ReactNode;
}

export const PointControl = (props: Props) => (
  <>
    {props.rule.type === "single" && (
      <PointSingle
        initial={props.rule.initial}
        color={props.color}
        onChange={(active) => {
          if (props.rule.type !== "single") return; // type narrowing

          props.team.point.state[props.rule.name] = active;
          props.onChange(active);
        }}
      >
        {props.children}
      </PointSingle>
    )}
    {props.rule.type === "countable" && (
      <PointCountable
        initial={props.rule.initial}
        color={props.color}
        validate={props.rule.validate}
        onChange={(count) => {
          if (props.rule.type !== "countable") return; // type narrowing

          props.team.point.state[props.rule.name] = count;
          props.onChange(count);
        }}
      >
        {props.children}
      </PointCountable>
    )}
  </>
);
