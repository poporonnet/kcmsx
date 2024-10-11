/**
 * 走行の終了状態
 */
type FinishState = "goal" | "finished";

/**
 * 走行結果の基本型
 */
type RunResultBase = {
  id: string;
  teamID: string;
  points: number;
};

/**
 * 走行結果の終了状態にかかわる情報
 * @description `goalTimeSeconds`は必ず存在し、数値か`null`である
 */
type RunResultFinishRecord<
  State extends FinishState,
  GoalTimeSeconds extends number | null,
> = {
  finishState: State;
  goalTimeSeconds: GoalTimeSeconds;
};

/**
 * ゴールした場合の走行結果
 */
type RunResultGoal = RunResultBase & RunResultFinishRecord<"goal", number>;

/**
 * フィニッシュした場合の走行結果
 */
type RunResultFinished = RunResultBase &
  RunResultFinishRecord<"finished", null>;

/**
 * 走行結果
 */
export type RunResult = RunResultGoal | RunResultFinished;

/**
 * 走行結果作成に必要な情報
 */
export type CreateRunResultArgs =
  | Omit<RunResultGoal, "id">
  | Omit<RunResultFinished, "id">;
