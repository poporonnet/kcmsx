import { createRoute } from '@hono/zod-openapi';
import {
  CommonErrorSchema,
  GetMatchIDParamsSchema,
  GetMatchIDResponseSchema,
  GetMatchPublicResponseSchema,
  GetMatchResponseSchema,
  GetMatchRunResultParamsSchema,
  GetMatchRunResultResponseSchema,
  GetMatchTypeParamsSchema,
  GetMatchTypeResponseSchema,
  GetRankingParamsSchema,
  GetRankingResponseSchema,
  GetTournamentParamsSchema,
  GetTournamentResponseSchema,
  PostMatchGenerateManualParamsSchema,
  PostMatchGenerateManualRequestSchema,
  PostMatchGenerateManualResponseSchema,
  PostMatchGenerateParamsSchema,
  PostMatchGenerateResponseSchema,
  PostMatchRunResultParamsSchema,
  PostMatchRunResultRequestSchema,
  PostMatchWinnerIDParamsSchema,
  PostMatchWinnerIDRequestSchema,
  PostPreMatchGenerateResponseSchema,
} from '../match/adaptor/validator/match';

export const GetMatchRoute = createRoute({
  method: 'get',
  path: '/match',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetMatchResponseSchema,
        },
      },
      description: 'Retrieve all matches',
    },
    400: {
      content: {
        'application/json': {
          schema: CommonErrorSchema,
        },
      },
      description: 'Common error',
    },
  },
});

export const GetMatchTypeRoute = createRoute({
  method: 'get',
  path: '/match/{matchType}',
  request: { params: GetMatchTypeParamsSchema },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetMatchTypeResponseSchema,
        },
      },
      description: 'Retrieve all matches by match type',
    },
    400: {
      content: {
        'application/json': {
          schema: CommonErrorSchema,
        },
      },
      description: 'Common error',
    },
  },
});

export const GetMatchIDRoute = createRoute({
  method: 'get',
  path: '/match/{matchType}/{matchID}',
  request: { params: GetMatchIDParamsSchema },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetMatchIDResponseSchema,
        },
      },
      description: 'Retrieve a match by matchID',
    },
    400: {
      content: {
        'application/json': {
          schema: CommonErrorSchema,
        },
      },
      description: 'Common error',
    },
  },
});

export const GetMatchRunResultRoute = createRoute({
  method: 'get',
  path: '/match/{matchType}/{matchID}/run_result',
  request: { params: GetMatchRunResultParamsSchema },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetMatchRunResultResponseSchema,
        },
      },
      description: 'Retrieve run result',
    },
    400: {
      content: {
        'application/json': {
          schema: CommonErrorSchema,
        },
      },
      description: 'Common error',
    },
  },
});

export const PostMatchGenerateRoute = createRoute({
  method: 'post',
  path: '/match/{matchType}/{departmentType}/generate',
  request: { params: PostMatchGenerateParamsSchema },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PostMatchGenerateResponseSchema,
        },
      },
      description: 'Generate match table',
    },
    400: {
      content: {
        'application/json': {
          schema: CommonErrorSchema,
        },
      },
      description: 'Common error',
    },
  },
});

export const PostPreMatchGenerateRoute = createRoute({
  method: 'post',
  path: '/match/pre/generate',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PostPreMatchGenerateResponseSchema,
        },
      },
      description: 'Generate match table',
    },
    400: {
      content: {
        'application/json': {
          schema: CommonErrorSchema,
        },
      },
      description: 'Common error',
    },
  },
});

export const PostMatchGenerateManualRoute = createRoute({
  method: 'post',
  path: '/match/main/{departmentType}/generate/manual',
  request: {
    params: PostMatchGenerateManualParamsSchema,
    body: {
      content: {
        'application/json': { schema: PostMatchGenerateManualRequestSchema },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PostMatchGenerateManualResponseSchema,
        },
      },
      description: 'Generate match table',
    },
    400: {
      content: {
        'application/json': {
          schema: CommonErrorSchema,
        },
      },
      description: 'Common error',
    },
  },
});

export const PostMatchWinnerIDRoute = createRoute({
  method: 'post',
  path: '/match/main/{matchID}/winner',
  request: {
    params: PostMatchWinnerIDParamsSchema,
    body: {
      content: {
        'application/json': { schema: PostMatchWinnerIDRequestSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'OK',
    },
    400: {
      content: {
        'application/json': {
          schema: CommonErrorSchema,
        },
      },
      description: 'Common error',
    },
  },
});

export const PostMatchRunResultRoute = createRoute({
  method: 'post',
  path: '/match/{matchType}/{matchID}/run_result',
  request: {
    params: PostMatchRunResultParamsSchema,
    body: {
      content: {
        'application/json': { schema: PostMatchRunResultRequestSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Post run result',
    },
    400: {
      content: {
        'application/json': {
          schema: CommonErrorSchema,
        },
      },
      description: 'Common error',
    },
  },
});

export const GetRankingRoute = createRoute({
  method: 'get',
  path: '/contest/{matchType}/{departmentType}/ranking',
  request: { params: GetRankingParamsSchema },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetRankingResponseSchema,
        },
      },
      description: 'Get Ranking',
    },
    400: {
      content: {
        'application/json': {
          schema: CommonErrorSchema,
        },
      },
      description: 'Common error',
    },
  },
});

export const GetTournamentRoute = createRoute({
  method: 'get',
  path: '/match/main/{departmentType}/tournament',
  request: {
    params: GetTournamentParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetTournamentResponseSchema,
        },
      },
      description: 'Get main tournament',
    },
    400: {
      content: {
        'application/json': {
          schema: CommonErrorSchema,
        },
      },
      description: 'Common error',
    },
  },
});

export const GetMatchPublicRoute = createRoute({
  method: 'get',
  path: '/match/public',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetMatchPublicResponseSchema,
        },
      },
      description: 'Retrieve all matches for public',
    },
    400: {
      content: {
        'application/json': {
          schema: CommonErrorSchema,
        },
      },
      description: 'Common error',
    },
  },
});
