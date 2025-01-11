import { DepartmentType, MatchType } from "config";
import { RunResult } from "./runResult";

/**
 * idとチーム名を持つチーム情報
 * @todo Teamとチーム名のプロパティ名が異なる (`name` - `teamName`)
 */
type BriefTeam = {
  id: string;
  teamName: string;
};

/**
 * マッチの基本型
 */
type MatchBase = {
  id: string;
  matchCode: `${number}-${number}`;
  departmentType: DepartmentType;
  runResults: RunResult[];
};

/**
 * マッチの試合種別にかかわる情報
 */
type MatchTypeRecord<Type extends MatchType> = {
  matchType: Type;
};

/**
 * 予選のマッチ
 */
export type PreMatch = MatchBase &
  MatchTypeRecord<"pre"> & {
    leftTeam?: BriefTeam;
    rightTeam?: BriefTeam;
  };

/**
 * 本戦のマッチ
 */
export type MainMatch = MatchBase &
  MatchTypeRecord<"main"> & {
    team1: BriefTeam;
    team2: BriefTeam;
    winnerID: string;
  };

/**
 * マッチ
 */
export type Match = PreMatch | MainMatch;

/**
 * チーム情報をidのみ持つ予選のマッチ
 * @description `POST /match/{matchType}/{departmentType}/generate`のみで使われる
 */
export type ShortPreMatch = MatchBase & {
  leftTeamID?: string;
  rightTeamID?: string;
};

/**
 * チーム情報をidのみ持つ本戦のマッチ
 * @description `POST /match/{matchType}/{departmentType}/generate`のみで使われる
 */
export type ShortMainMatch = MatchBase & {
  team1ID: string;
  team2ID: string;
  winnerID: string;
};

/**
 * チーム情報をidのみ持つマッチ
 * @description `POST /match/{matchType}/{departmentType}/generate`のみで使われる
 */
export type ShortMatch = ShortPreMatch | ShortMainMatch;

/**
 * 本戦のマッチのマニュアル生成に必要な情報
 * @description `POST /match/main/{departmentType}/generate/manual`のみで使われる
 */
export type CreateMainMatchManualArgs = {
  teamIDs: string[];
};
