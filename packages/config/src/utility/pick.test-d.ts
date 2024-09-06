import { describe, expectTypeOf, it } from "vitest";
import { pick } from "./pick";

describe("pickが正しく機能する", () => {
  it("リテラル型が保存される", () => {
    const target = [
      { key: "value1" },
      { key: "value2" },
      { key: "value3" },
    ] as const satisfies { key: string }[];

    const values = pick(target, "key");

    expectTypeOf(values).not.toEqualTypeOf<string[]>();
    expectTypeOf(values).not.toEqualTypeOf<
      ("value1" | "value2" | "value3")[]
    >();
    expectTypeOf(values).toEqualTypeOf<["value1", "value2", "value3"]>();
  });
});
