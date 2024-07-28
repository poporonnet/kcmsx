import { describe, expect, it } from "vitest";
import { against } from "./against";

describe("againstが正しく動作する", () => {
  it("正しく反対のSideを返す", () => {
    expect(against("left")).toBe("right");
    expect(against("right")).toBe("left");
  });
});
