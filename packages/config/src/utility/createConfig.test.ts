import { describe, expect, it } from "vitest";
import { createConfig } from "./createConfig";

describe("正しい設定を生成できる", () => {
  it("最小項目の設定を生成できる", () => {
    const point = (done: boolean) => (done ? 1 : 0);

    const config = createConfig(
      {
        contestName: "かにロボコン",
        robotTypes: ["wheel"],
        departments: [
          {
            type: "elementary",
            name: "小学生部門",
            robotTypes: ["wheel"],
          },
        ],
        matches: [
          {
            type: "pre",
            name: "予選",
            limitSeconds: 180,
          },
        ],
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

    expect(config.departments.length).toBe(1);
    expect(config.departments[0].type).toBe("elementary");
    expect(config.departments[0].name).toBe("小学生部門");
    expect(config.departments[0].robotTypes).toEqual(["wheel"]);

    expect(config.matches.length).toBe(1);
    expect(config.matches[0].type).toBe("pre");
    expect(config.matches[0].name).toBe("予選");
    expect(config.matches[0].limitSeconds).toBe(180);

    expect(config.rules.length).toBe(1);
    expect(config.rules[0].name).toBe("goal");
    expect(config.rules[0].label).toBe("ゴール");
    expect(config.rules[0].type).toBe("single");
    expect(config.rules[0].point).toBe(point);
    expect(config.rules[0].visible).toBe(undefined);
    expect(config.rules[0].changeable).toBe(undefined);
    expect(config.rules[0].scorable).toBe(undefined);

    expect(config.department.elementary.name).toBe("小学生部門");
    expect(config.department.elementary.robotTypes).toEqual(["wheel"]);

    expect(config.match.pre.name).toBe("予選");
    expect(config.match.pre.limitSeconds).toBe(180);
  });

  it("複数項目の設定を生成できる", () => {});

  it("conditionが正しく設定できる", () => {});
});
