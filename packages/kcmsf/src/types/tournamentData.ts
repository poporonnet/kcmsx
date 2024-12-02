import { RawNodeDatum } from "react-d3-tree";
import { Tournament } from "./tournament";

/**
 * トーナメントノードの種類
 */
type DataType = Tournament["type"];

/**
 * トーナメントデータの種類にかかわる情報
 */
type DataTypeRecord<Type extends DataType> = { type: Type };

/**
 * トーナメントデータの`Attributes`
 */
export type TournamentAttributes<Type extends DataType> = Type extends "match"
  ? {
      matchId: string;
      matchCode: string;
      team1Id: string;
      team1Name: string;
      team2Id: string;
      team2Name: string;
      winnerId?: string;
    } & DataTypeRecord<"match">
  : {
      teamId: string;
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
