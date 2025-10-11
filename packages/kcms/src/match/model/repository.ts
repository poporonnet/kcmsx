import { Option, Result } from '@mikuroxina/mini-fn';
import { MainMatch, MainMatchID } from './main.js';
import { PreMatch, PreMatchID } from './pre.js';

export type MatchIndexAndCourseIndex = { courseIndex: number; matchIndex: number };

export interface PreMatchRepository {
  /**
   * @description 試合を作成
   * @param match 試合する試合オブジェクト ({@link PreMatch})
   * @returns 成功時: void 失敗時: Error
   * @example
   *   // PreMatch作成
   *   const preMatch = await repository.create(...PreMatch...);
   *   if (Result.isErr(preMatch)) throw new Error("試合を作成できませんでした");
   *   Result.unwrap(preMatch); // 成功時はvoidが返ってくる
   */
  create(match: PreMatch): Promise<Result.Result<Error, void>>;
  /**
   * @description 試合を作成
   * @param matches 試合する試合オブジェクトの**配列** ({@link PreMatch})
   * @returns 成功時: void 失敗時: Error
   * @example
   *   // PreMatch作成
   *   const preMatch = await repository.create(...PreMatch[]...);
   *   if (Result.isErr(preMatch)) throw new Error("試合を作成できませんでした");
   *   Result.unwrap(preMatch); // 成功時はvoidが返ってくる
   */
  createBulk(matches: PreMatch[]): Promise<Result.Result<Error, void>>;

  /**
   * @description 試合をIDで検索
   * @param id 試合ID ({@link PreMatchID})
   * @returns 試合が見つかった場合: Option.some({@link PreMatch}) 試合が見つからなかった場合: Option.none()
   * @example
   *  // PreMatchを検索する場合
   *  const match = await repository.findByID('12345' as PreMatchID);
   *  if (Option.isNone(match)) {
   *    console.log('試合が見つかりませんでした');
   *  }
   *
   *  Option.unwrap(match); // PreMatchオブジェクトが返ってくる
   * */
  findByID(id: PreMatchID): Promise<Option.Option<PreMatch>>;

  /**
   * @description 試合を更新
   * @param match 更新する試合オブジェクト ({@link PreMatch})
   * @returns 成功時: void 失敗時: Error
   */
  update(match: PreMatch): Promise<Result.Result<Error, void>>;

  /**
   * @description 全ての試合を取得
   * @returns 成功時: Result.ok({@link PreMatch}) 失敗時: Error
   */
  findAll(): Promise<Result.Result<Error, PreMatch[]>>;

  /**
   * @description 試合が存在する全てのコースごとに最大の試合番号を取得
   * @returns 成功時: Result.ok({@link MatchIndexAndCourseIndex}) 失敗時: Error
   */
  findMaxMatchIndexAll(): Promise<Result.Result<Error, MatchIndexAndCourseIndex[]>>;
}

export interface MainMatchRepository {
  /**
   * @description 試合を作成
   * @param match 試合する試合オブジェクト ({@link MainMatch})
   * @returns 成功時: void 失敗時: Error
   * @example
   *   // MainMatch作成
   *   const mainMatch = await repository.create(...MainMatch...);
   *   if (Result.isErr(mainMatch)) throw new Error("試合を作成できませんでした");
   *   Result.unwrap(mainMatch); // 成功時はvoidが返ってくる
   */
  create(match: MainMatch): Promise<Result.Result<Error, void>>;
  /**
   * @description 試合を作成
   * @param matches 試合する試合オブジェクトの**配列** ({@link MainMatch})
   * @returns 成功時: void 失敗時: Error
   * @example
   *   // MainMatch作成
   *   const mainMatch = await repository.create(...MainMatch[]...);
   *   if (Result.isErr(mainMatch)) throw new Error("試合を作成できませんでした");
   *   Result.unwrap(mainMatch); // 成功時はvoidが返ってくる
   */
  createBulk(matches: MainMatch[]): Promise<Result.Result<Error, void>>;

  /**
   * @description 試合をIDで検索
   * @param id 試合ID ({@link MainMatchID})
   * @returns 試合が見つかった場合: Option.some(指定したIDの型に応じた試合オブジェクト) 試合が見つからなかった場合: Option.none()
   * @example
   *  // PreMatchを検索する場合
   *  const match = await repository.findByID('12345' as PreMatchID);
   *  if (Option.isNone(match)) {
   *    console.log('試合が見つかりませんでした');
   *  }
   *
   *  Option.unwrap(match); // PreMatchオブジェクトが返ってくる
   * */
  findByID(id: MainMatchID): Promise<Option.Option<MainMatch>>;

  /**
   * @description 試合を更新
   * @param match 更新する試合オブジェクト ({@link MainMatch})
   * @returns 成功時: void 失敗時: Error
   */
  update(match: MainMatch): Promise<Result.Result<Error, void>>;

  /**
   * @description 全ての試合を取得
   * @returns 成功時: Result.ok({@link MainMatch}) 失敗時: Error
   */
  findAll(): Promise<Result.Result<Error, MainMatch[]>>;

  /**
   * @description 試合が存在する全てのコースごとに最大の試合番号を取得
   * @returns 成功時: Result.ok({@link MatchIndexAndCourseIndex}) 失敗時: Error
   */
  findMaxMatchIndexAll(): Promise<Result.Result<Error, MatchIndexAndCourseIndex[]>>;
}
