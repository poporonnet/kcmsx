import { FinishState } from '../model/runResult';

/** @description 受け取るfinishState(全部小文字)をFinishState(全部大文字)に変換する
 * @param finishState
 * */

export const finishStateConversion = (finishState: string) => {
  switch (finishState) {
    case 'finished':
      return 'FINISHED' as FinishState;
    case 'goal':
      return 'GOAL' as FinishState;
    default:
      throw new Error('Invalid finishState');
  }
};
