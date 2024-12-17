import { describe, expect, it } from "vitest";
import { DerivedDepartmentConfig } from "../types/departmentConfig";
import { DerivedCourseConfig, DerivedMatchConfig } from "../types/matchConfig";
import { DerivedPremiseState } from "../types/premise";
import { DerivedRobotConfig } from "../types/robotConfig";
import { DerivedPointState, DerivedRuleBaseVariant } from "../types/rule";
import { DerivedSponsorConfig, SponsorClass } from "../types/sponsorConfig";
import { createConfig } from "./createConfig";

describe("正しい設定を生成できる", () => {
  it("最小項目の設定を生成できる", () => {
    const point = (done: boolean) => (done ? 1 : 0);

    const config = createConfig(
      {
        contestName: "かにロボコン",
        robots: [{ type: "wheel", name: "車輪型" }],
        departments: [
          { type: "elementary", name: "小学生部門", robotTypes: ["wheel"] },
        ],
        match: {
          pre: {
            name: "予選",
            limitSeconds: 180,
            course: { elementary: [1, 2, 3] },
          },
          main: {
            name: "本戦",
            limitSeconds: 180,
            course: { elementary: [1, 2, 3] },
          },
        },
        rules: [
          {
            name: "goal",
            label: "ゴール",
            type: "single",
            initial: false,
            point,
          },
        ],
        sponsors: [],
      },
      {}
    );

    expect(config.contestName).toBe("かにロボコン");

    expect(config.robots).toHaveLength(1);
    expect(config.robots[0].type).toBe("wheel");
    expect(config.robots[0].name).toBe("車輪型");

    expect(config.departments).toHaveLength(1);
    expect(config.departments[0].type).toBe("elementary");
    expect(config.departments[0].name).toBe("小学生部門");
    expect(config.departments[0].robotTypes).toEqual(["wheel"]);

    expect(config.matches).toHaveLength(2);
    expect(config.matches[0].type).toBe("pre");
    expect(config.matches[0].name).toBe("予選");
    expect(config.matches[0].limitSeconds).toBe(180);
    expect(config.matches[0].course.elementary).toEqual([1, 2, 3]);

    expect(config.rules).toHaveLength(1);
    expect(config.rules[0].name).toBe("goal");
    expect(config.rules[0].label).toBe("ゴール");
    expect(config.rules[0].type).toBe("single");
    expect(config.rules[0].point).toBe(point);
    expect(config.rules[0].visible).toBeUndefined();
    expect(config.rules[0].changeable).toBeUndefined();
    expect(config.rules[0].scorable).toBeUndefined();

    expect(config.sponsors).toHaveLength(0);

    expect(config.robotTypes).toEqual(["wheel"]);
    expect(config.robot.wheel.name).toBe("車輪型");

    expect(config.departmentTypes).toEqual(["elementary"]);
    expect(config.department.elementary.name).toBe("小学生部門");
    expect(config.department.elementary.robotTypes).toEqual(["wheel"]);

    expect(config.matchTypes).toEqual(["pre", "main"]);
    expect(config.match.pre.name).toBe("予選");
    expect(config.match.pre.limitSeconds).toBe(180);
    expect(config.match.pre.course.elementary).toEqual([1, 2, 3]);
  });

  it("複数項目の設定を生成できる", () => {
    type Robot = DerivedRobotConfig<string, string>;
    type Robots = [Robot, ...Robot[]];
    type RobotTypes = [Robot["type"], ...Robot["type"][]];
    type Department = DerivedDepartmentConfig<string, string, RobotTypes>;
    type Departments = [Department, ...Department[]];
    type Courses = [number, ...number[]];
    type Match = DerivedMatchConfig<
      string,
      number,
      Robots,
      Departments,
      Courses,
      DerivedCourseConfig<Robots, Departments, Courses> & { __department0: [0] } // ValidCourseConfigsを通過させるため
    >;
    type Sponsor = DerivedSponsorConfig<string, SponsorClass, string>;
    type Sponsors = [Sponsor, ...Sponsor[]];
    type Rule = DerivedRuleBaseVariant;
    type Rules = [Rule, ...Rule[]];

    const range = [...new Array(10)].map((_, i) => i);

    const robots = range.map((i) => ({
      type: `robot${i}`,
      name: `ロボット${i}`,
    })) as Robots;
    const departments = range.map(
      (i): Department => ({
        type: `department${i}`,
        name: `部門${i}`,
        robotTypes: robots.slice(0, i + 1).map((r) => r.type) as RobotTypes,
      })
    ) as Departments;
    const match: Match = {
      pre: {
        name: "予選",
        limitSeconds: 180,
        course: { elementary: [1], __department0: [0] },
      },
      main: {
        name: "本戦",
        limitSeconds: 180,
        course: { elementary: [1], __department0: [0] },
      },
    };
    const singleRules = range.map(
      (i): Rule => ({
        name: `rule${i}-1`,
        label: `ルール${i}-1`,
        type: "single" as const,
        initial: i % 2 == 0,
        point: (done: boolean) => (done ? 1 : 0),
      })
    );
    const countableRules = range.map(
      (i): Rule => ({
        name: `rule${i}-2`,
        label: `ルール${i}-2`,
        type: "countable" as const,
        initial: i,
        point: (value: number) => value,
        validate: (value: number) => 0 <= value && value <= i * 100,
      })
    );
    const rules = [...singleRules, ...countableRules] as Rules;
    const sponsors = range.map((i) => ({
      name: `スポンサー${i}`,
      class: (["platinum", "gold", "silver", "bronze"] as const)[i % 4],
      logo: `https://sponsor${i}.example.com/logo`,
    })) as Sponsors;

    const config = createConfig(
      {
        contestName: "かにロボコン",
        robots,
        departments,
        match,
        rules,
        sponsors,
      },
      {}
    );

    expect(config.robots).toEqual(robots);
    expect(config.departments).toEqual(departments);
    expect(config.match).toEqual(match);
    expect(config.rules).toEqual(rules);
    expect(config.sponsors).toEqual(sponsors);
    expect(config.robotTypes).toEqual(robots.map((r) => r.type));
    expect(config.departmentTypes).toEqual(departments.map((d) => d.type));
    expect(config.matches).toEqual(
      Object.entries(match).map(([type, m]) => ({ type, ...m }))
    );
    expect(config.matchTypes).toEqual(["pre", "main"]);
    range.map((i) =>
      expect(config.robot).toHaveProperty([`robot${i}`, "name"], `ロボット${i}`)
    );
    range.map((i) =>
      expect(config.department).toHaveProperty(
        [`department${i}`, "name"],
        `部門${i}`
      )
    );
    expect(config.match.pre.name).toBe("予選");
    expect(config.match.main.name).toBe("本戦");
  });

  it("conditionが正しく設定できる", () => {
    type PremiseState = DerivedPremiseState<
      "pre" | "main",
      "wheel",
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
      state.matchState[state.side]?.getGoalTimeSeconds() != undefined;
    const changeable = (state: PremiseState) =>
      state.matchInfo?.teams[state.side]?.robotType == "wheel";

    const config = createConfig(
      {
        contestName: "かにロボコン",
        robots: [{ type: "wheel", name: "車輪型" }],
        departments: [
          { type: "elementary", name: "小学生部門", robotTypes: ["wheel"] },
        ],
        match: {
          pre: {
            name: "予選",
            limitSeconds: 180,
            course: { elementary: [1, 2, 3] },
          },
          main: {
            name: "本戦",
            limitSeconds: 180,
            course: { elementary: [1, 2, 3] },
          },
        },
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
        sponsors: [],
      },
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
