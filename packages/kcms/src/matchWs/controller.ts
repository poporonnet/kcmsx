// FIXME: 雑実装

import { Result } from '@mikuroxina/mini-fn';
import { MainMatchID } from '../match/model/main';
import { PreMatchID } from '../match/model/pre';
import { GetMatchService } from '../match/service/get';

type LivingMatch = {
  id: string;
  eventTarget: EventTarget;
};

export class MatchWebSocketController {
  private readonly livingMatches: Map<string, LivingMatch>;

  constructor(private readonly getMatch: GetMatchService) {
    this.livingMatches = new Map();
  }

  async listenMatch(
    matchId: PreMatchID | MainMatchID,
    wsSend: (data: string) => void
  ): Promise<Result.Result<Error, LivingMatch>> {
    const matchRes = await this.getMatch.findByID(matchId);
    if (Result.isErr(matchRes)) return matchRes;

    const livingMatch: LivingMatch = this.livingMatches.get(matchId) ?? {
      id: matchId,
      eventTarget: new EventTarget(),
    };
    if (!this.livingMatches.has(matchId)) this.livingMatches.set(matchId, livingMatch);

    livingMatch.eventTarget.addEventListener('update', (event) => {
      if (!(event instanceof CustomEvent)) return;

      wsSend(event.detail);
    });

    return Result.ok(livingMatch);
  }

  async updateMatchState(
    matchId: PreMatchID | MainMatchID,
    data: string
  ): Promise<Result.Result<Error, LivingMatch>> {
    const matchRes = await this.getMatch.findByID(matchId);
    if (Result.isErr(matchRes)) return matchRes;

    const livingMatch: LivingMatch = this.livingMatches.get(matchId) ?? {
      id: matchId,
      eventTarget: new EventTarget(),
    };
    if (!this.livingMatches.has(matchId)) this.livingMatches.set(matchId, livingMatch);

    livingMatch.eventTarget.dispatchEvent(new CustomEvent('update', { detail: data }));

    return Result.ok(livingMatch);
  }
}
