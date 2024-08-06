import { Team } from './team.js';
import { Option, Result } from '@mikuroxina/mini-fn';

export interface TeamRepository {
  /**
   * @description チームを作成
   * @param team
   * @returns 成功時: void 失敗時: Error
   */
  create(team: Team): Promise<Result.Result<Error, void>>;

  /**
   * @description チームを作成
   * @param entries チームオブジェクトの**配列**
   * @returns 成功時: void 失敗時: Error
   */
  createBulk(entries: Team[]): Promise<Result.Result<Error, void>>;

  /**
   * @description チームをチーム名で検索
   * @param name チームID
   * @returns チームが見つかった場合: Option.some({@link Team}) チームが見つからなかった場合: Option.none()
   * */
  findByTeamName(name: string): Promise<Option.Option<Team>>;
  /**
   * @description チームをIDで検索
   * @param id チームID
   * @returns チームが見つかった場合: Option.some({@link Team}) チームが見つからなかった場合: Option.none()
   * */
  findByID(id: string): Promise<Option.Option<Team>>;

  /**
   * @description 全てのチームを取得
   * @returns 成功時: Result.ok({@link Team}) 失敗時: Error
   */
  findAll(): Promise<Result.Result<Error, Team[]>>;

  /**
   * @description エントリーしているチームを取得
   * @returns 成功時: Result.ok({@link Team}) 失敗時: Error
   */
  findAllEntered(): Promise<Result.Result<Error, Team[]>>;

  /**
   * @description チームを削除
   * @param id
   * @returns 成功時: Option.none() 失敗時: Option.some(Error)
   */
  delete(id: string): Promise<Option.Option<Error>>;
}
