import { RawNodeDatum } from "react-d3-tree";

/**
 * トーナメントノードの種類
 */
type DataType = "team" | "match";

/**
 * トーナメントデータの種類にかかわる情報
 */
type DataTypeRecord<Type extends DataType> = { type: Type };

/**
 * トーナメントデータの`Attributes`
 */
export type TournamentAttributes<Type extends DataType> = Type extends "match"
  ? {
      matchID: string;
      matchCode: string;
      team1ID: string;
      team1Name: string;
      team2ID: string;
      team2Name: string;
      winnerID?: string;
    } & DataTypeRecord<"match">
  : {
      teamID: string;
      teamName: string;
    } & DataTypeRecord<"team">;

/**
 * トーナメントデータの`Children`
 */
export type TournamentChildren<Type extends DataType> = Type extends "match"
  ? [TournamentData<DataType>, TournamentData<DataType>]
  : undefined;

/**
 * 表示用のトーナメントデータの型
 */
export interface TournamentData<Type extends DataType = DataType>
  extends RawNodeDatum {
  name: string;
  attributes: TournamentAttributes<Type>;
  children?: TournamentChildren<Type>;
}
