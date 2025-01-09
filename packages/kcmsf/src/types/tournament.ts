/**
 * ノードの種類にかかわる情報
 */
export type NodeType<Type extends string> = {
  type: Type;
};

/**
 * ノード
 */
export type TournamentNode = TeamNode | MatchNode;

/**
 * チームのノード
 */
export type TeamNode = {
  teamID: string;
  teamName: string;
} & NodeType<"team">;

/**
 * マッチのノード
 */
export type MatchNode = {
  matchID: string;
  matchCode: string;
  team1ID: string;
  team2ID: string;
  winnerID?: string;
  previousNode1: TournamentNode;
  previousNode2: TournamentNode;
} & NodeType<"match">;

/**
 * トーナメント
 * @description 1つのトーナメントは1つのルートノード
 */
export type Tournament = TournamentNode;
