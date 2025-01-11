import { MainMatch } from "./match";

/**
 * ノード
 */
export type TournamentNode = Omit<MainMatch, "runResults"> & {
  childMatch1?: Tournament;
  childMatch2?: Tournament;
};

/**
 * トーナメント
 * @description 1つのトーナメントは1つのルートノード
 */
export type Tournament = TournamentNode;
