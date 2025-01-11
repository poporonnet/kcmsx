import { Option, Result } from '@mikuroxina/mini-fn';
import { Team } from './team.js';

/**
 * チームを管理するRepository
 */
export interface TeamRepository {
  /**
   * @description チームを作成(参加登録)する
   * @param team 作成するチームのデータ
   * @return 成功時: Team, 失敗時: Error
   */
  create(team: Team): Promise<Result.Result<Error, Team>>;

  /**
   * @description チーム名でチームを検索
   * @param name チーム名
   * @return 成功時: Team, 失敗時(見つからない時も含む): Option.none()
   * ToDo: Result.Result<Error, Team> で置き換える
   */
  findByTeamName(name: string): Promise<Option.Option<Team>>;

  /**
   * @description 全てのチームを取得
   * @return 成功時: Team[], 失敗時: Error
   * ToDo: Result.Result<Error, Team[]> で置き換える
   */
  findAll(): Promise<Result.Result<Error, Team[]>>;

  /**
   * @description チームIDでチームを検索
   * @param id チームID
   * @return 成功時: Team, 失敗時(見つからない時も含む): Option.none()
   * ToDo: Result.Result<Error, Team> で置き換える
   */
  findByID(id: string): Promise<Option.Option<Team>>;

  /**
   * @description チームを削除(登録解除)する
   * @param id 削除するチームのID
   * @return 成功時: Option.none(), 失敗時: Error
   */
  delete(id: string): Promise<Option.Option<Error>>;

  /**
   * @description
   * チームを更新:\
   * *与えられたデータで上書きします。*
   * @param team 更新するチームのデータ
   * @return 成功時: Team, 失敗時: Error
   */
  update(team: Team): Promise<Result.Result<Error, Team>>;

  /**
   * @description
   * 付与されているゼッケン番号の最大値を取得
   * @return まだ誰にも付与されていない時: 0, 出ない：
   */
  getMaxEntryCode(): Promise<Result.Result<Error, number>>;
}
