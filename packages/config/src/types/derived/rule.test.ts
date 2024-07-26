import { describe, expect, it } from "vitest";
import { config } from "../../config";
import { initialPointState } from "./rule";

describe("initialPointStateが正しく生成される", () => {
  it("初期値が正しく設定されている", () => {
    config.rules.forEach((rule) =>
      expect(initialPointState[rule.name]).toBe(rule.initial)
    );
  });
});
