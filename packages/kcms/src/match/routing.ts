import { createRoute } from '@hono/zod-openapi';
import {
  CommonErrorSchema,
  GetMatchResponseSchema,
  GetMatchTypeParamsSchema,
  GetMatchTypeResponseSchema,
  GetMatchIdParamsSchema,
  GetMatchIdResponseSchema,
  GetMatchRunResultResponseSchema,
  PostMatchRunResultRequestSchema,
  PostMatchRunResultParamsSchema,
  GetMatchRunResultParamsSchema,
  GetRankingParamsSchema,
  GetRankingResponseSchema,
  PostMatchGenerateParamsSchema,
  PostMatchGenerateResponseSchema,
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

export const GetMatchIdRoute = createRoute({
  method: 'get',
  path: '/match/{matchType}/{matchID}',
  request: { params: GetMatchIdParamsSchema },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetMatchIdResponseSchema,
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

export const GetMatchGenerateRoute = createRoute({
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
