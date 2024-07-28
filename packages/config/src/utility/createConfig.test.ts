import { describe, expect, it } from "vitest";
import { DerivedDepartmentConfig } from "../types/departmentConfig";
import { DerivedMatchConfig } from "../types/matchConfig";
import { DerivedPremiseState } from "../types/premise";
import { DerivedPointState, DerivedRuleBaseVariant } from "../types/rule";
import { createConfig } from "./createConfig";

describe("正しい設定を生成できる", () => {
  it("最小項目の設定を生成できる", () => {
    const point = (done: boolean) => (done ? 1 : 0);

    const config = createConfig(
      {
        contestName: "かにロボコン",
        robotTypes: ["wheel"],
        departments: [
          { type: "elementary", name: "小学生部門", robotTypes: ["wheel"] },
        ],
        matches: [{ type: "pre", name: "予選", limitSeconds: 180 }],
        rules: [
          {
            name: "goal",
            label: "ゴール",
            type: "single",
            initial: false,
            point,
          },
        ],
      } as const,
      {}
    );

    expect(config.contestName).toBe("かにロボコン");
    expect(config.robotTypes).toEqual(["wheel"]);

    expect(config.departments).toHaveLength(1);
    expect(config.departments[0].type).toBe("elementary");
    expect(config.departments[0].name).toBe("小学生部門");
    expect(config.departments[0].robotTypes).toEqual(["wheel"]);

    expect(config.matches).toHaveLength(1);
    expect(config.matches[0].type).toBe("pre");
    expect(config.matches[0].name).toBe("予選");
    expect(config.matches[0].limitSeconds).toBe(180);

    expect(config.rules).toHaveLength(1);
    expect(config.rules[0].name).toBe("goal");
    expect(config.rules[0].label).toBe("ゴール");
    expect(config.rules[0].type).toBe("single");
    expect(config.rules[0].point).toBe(point);
    expect(config.rules[0].visible).toBeUndefined();
    expect(config.rules[0].changeable).toBeUndefined();
    expect(config.rules[0].scorable).toBeUndefined();

    expect(config.department.elementary.name).toBe("小学生部門");
    expect(config.department.elementary.robotTypes).toEqual(["wheel"]);

    expect(config.match.pre.name).toBe("予選");
    expect(config.match.pre.limitSeconds).toBe(180);
  });

  it("複数項目の設定を生成できる", () => {
    type RobotTypes = [string, ...string[]];
    type Departments = [
      DerivedDepartmentConfig<string, string, RobotTypes>,
      ...DerivedDepartmentConfig<string, string, RobotTypes>[],
    ];
    type Matches = [
      DerivedMatchConfig<string, string, number>,
      ...DerivedMatchConfig<string, string, number>[],
    ];

    const range = [...new Array(10)].map((_, i) => i);

    const robotTypes = range.map((i) => `robot${i}`) as RobotTypes;
    const departments = range.map((i) => ({
      type: `department${i}`,
      name: `部門${i}`,
      robotTypes: robotTypes.slice(0, i) as RobotTypes[number][],
    })) as Departments;
    const matches = range.map((i) => ({
      type: `match${i}`,
      name: `試合${i}`,
      limitSeconds: 100 * i,
    })) as Matches;
    const singleRules = range.map((i) => ({
      name: `rule${i}-1`,
      label: `ルール${i}-1`,
      type: "single" as const,
      initial: i % 2 == 0,
      point: (done: boolean) => (done ? 1 : 0),
    }));
    const countableRules = range.map((i) => ({
      name: `rule${i}-2`,
      label: `ルール${i}-2`,
      type: "countable" as const,
      initial: i,
      point: (value: number) => value,
      validate: (value: number) => 0 <= value && value <= i * 100,
    }));
    const rules = [...singleRules, ...countableRules] as [
      DerivedRuleBaseVariant,
      ...DerivedRuleBaseVariant[],
    ];

    const config = createConfig(
      {
        contestName: "かにロボコン",
        robotTypes,
        departments,
        matches,
        rules,
      },
      {}
    );

    expect(config.robotTypes).toEqual(robotTypes);
    expect(config.departments).toEqual(departments);
    expect(config.matches).toEqual(matches);
    expect(config.rules).toEqual(rules);
    range.map((i) =>
      expect(config.department).toHaveProperty(
        [`department${i}`, "name"],
        `部門${i}`
      )
    );
    range.map((i) =>
      expect(config.match).toHaveProperty([`match${i}`, "name"], `試合${i}`)
    );
  });

  it("conditionが正しく設定できる", () => {
    type PremiseState = DerivedPremiseState<
      "pre",
      "elementary",
      DerivedPointState<{
        name: "goal";
        label: "ゴール";
        type: "single";
        initial: false;
        point: (done: boolean) => 0 | 1;
        validate: (done: boolean) => boolean;
      }>
    >;
    const visible = (state: PremiseState) =>
      state.matchInfo?.matchType == "pre";
    const scorable = (state: PremiseState) =>
      state.matchState[state.side].getGoalTimeSeconds() != undefined;
    const changeable = (state: PremiseState) =>
      !!state.matchInfo?.teams[state.side].isMultiWalk;

    const config = createConfig(
      {
        contestName: "かにロボコン",
        robotTypes: ["wheel"],
        departments: [
          { type: "elementary", name: "小学生部門", robotTypes: ["wheel"] },
        ],
        matches: [{ type: "pre", name: "予選", limitSeconds: 180 }],
        rules: [
          {
            name: "goal",
            label: "ゴール",
            type: "single",
            initial: false,
            point: (done: boolean) => (done ? 1 : 0),
            validate: (done: boolean) => done,
          },
        ],
      } as const,
      {
        goal: {
          visible,
          scorable,
          changeable,
        },
      }
    );

    expect(config.rules).toHaveLength(1);
    expect(config.rules[0].visible).toBe(visible);
    expect(config.rules[0].scorable).toBe(scorable);
    expect(config.rules[0].changeable).toBe(changeable);
  });
});
