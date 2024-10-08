import { Collect } from "../utility/pick";
import { UniqueRecords } from "./uniqueCollection";

/**
 * @description 1つのロボット設定の型
 */
export type RobotConfig = DerivedRobotConfig<string, string>;

/**
 * @description 1つのロボット設定の, リテラル型から導出される型
 */
export type DerivedRobotConfig<Type extends string, Name extends string> = {
  type: Type;
  name: Name;
};

/**
 * @description {@link RobotConfig}の配列から導出されるロボット設定のオブジェクト
 */
export type DerivedRobot<Robots extends RobotConfig[]> = {
  [R in Robots[number] as R["type"]]: Omit<R, "type">;
};

/**
 * @description {@link RobotConfig}の配列から導出されるロボット設定の`type`属性の配列
 */
export type DerivedRobotTypes<Robots extends RobotConfig[]> = Collect<
  RobotConfig,
  Robots,
  "type"
>;

/**
 * @description {@link Robots}が有効か判定する型
 * {@link RobotConfig}の`type`属性が重複していたらコンパイルに失敗する
 */
export type ValidRobotConfigs<Robots extends RobotConfig[]> =
  UniqueRecords<Robots, "type"> extends infer U
    ? Robots extends U
      ? Robots
      : U
    : never;
