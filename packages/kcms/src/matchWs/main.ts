// FIXME: 雑実装, API スキーマを書く, ドキュメント出力

import { Hono } from 'hono';
import { upgradeWebSocket } from 'hono/bun';
import { prismaClient } from '../adaptor';
import { PrismaMainMatchRepository } from '../match/adaptor/prisma/mainMatchRepository';
import { PrismaPreMatchRepository } from '../match/adaptor/prisma/preMatchRepository';
import { MainMatchID } from '../match/model/main';
import { PreMatchID } from '../match/model/pre';
import { GetMatchService } from '../match/service/get';
import { MatchWebSocketController } from './controller';

const preMatchRepository = new PrismaPreMatchRepository(prismaClient);
const mainMatchRepository = new PrismaMainMatchRepository(prismaClient);

const getMatchService = new GetMatchService(preMatchRepository, mainMatchRepository);

const matchWsController = new MatchWebSocketController(getMatchService);

export const matchWsHandler = new Hono();

matchWsHandler.get(
  '/match/:matchType/:matchId/ws/view',
  upgradeWebSocket((c) => {
    const { matchId } = c.req.param();

    return {
      onOpen: (_event, ws) => {
        matchWsController.listenMatch(matchId as PreMatchID | MainMatchID, (data) => ws.send(data));
      },
    };
  })
);

matchWsHandler.get(
  '/match/:matchType/:matchId/ws/update',
  upgradeWebSocket((c) => {
    const { matchId } = c.req.param();

    return {
      onMessage: (event) => {
        matchWsController.updateMatchState(
          matchId as PreMatchID | MainMatchID,
          event.data.toString()
        );
      },
    };
  })
);
