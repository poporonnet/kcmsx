import { describe, expectTypeOf, it } from "vitest";
import { upcase } from "./upcase";

describe("upcase関数の型テスト", () => {
  it("正しい型が返ってくる", () => {
    const state: "exampleString" = "exampleString";
    const values = upcase(state);
    expectTypeOf(values).toEqualTypeOf<"EXAMPLESTRING">();
  });
});
