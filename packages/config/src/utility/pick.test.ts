import { describe, expect, it } from "vitest";
import { pick } from "./pick";

describe("pickが正しく機能する", () => {
  it("正しくmapを行う", () => {
    const target = [
      { key: "value1" },
      { key: "value2" },
      { key: "value3" },
    ] as const satisfies { key: string }[];

    const values = pick(target, "key");

    expect(values).toEqual(["value1", "value2", "value3"]);
  });
});
