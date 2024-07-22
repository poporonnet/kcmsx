import { UniqueArray } from "./uniqueCollection";

/**
 * @description RobotTypesが有効か判定する型
 * 重複していたらコンパイルに失敗する
 */
export type ValidRobotTypes<RobotTypes extends readonly string[]> =
  UniqueArray<RobotTypes> extends infer U
    ? RobotTypes extends U
      ? RobotTypes
      : U
    : never;
