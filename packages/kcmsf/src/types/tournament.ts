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
  teamId: string;
  teamName: string;
} & NodeType<"team">;

/**
 * マッチのノード
 */
export type MatchNode = {
  matchId: string;
  matchCode: string;
  team1Id: string;
  team2Id: string;
  winnerId?: string;
  previousNode1: TournamentNode;
  previousNode2: TournamentNode;
} & NodeType<"match">;

/**
 * トーナメント
 * @description 1つのトーナメントは1つのルートノード
 */
export type Tournament = TournamentNode;
