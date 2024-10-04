import { createRoute } from '@hono/zod-openapi';
import {
  CommonErrorSchema,
  GetMatchResponseSchema,
  GetMatchTypeParamsSchema,
  GetMatchTypeResponseSchema,
  GetMatchRunResultResponseSchema,
  GetMatchRunResultRequestSchema,
  PostMatchRunResultRequestSchema,
  PostMatchRunResultRequestPathParamsSchema,
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

export const GetMatchRunResultRoute = createRoute({
  method: 'get',
  path: '/match/{matchType}/{matchId}/run_result',
  request: { params: GetMatchRunResultRequestSchema },
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
export const PostMatchRunResultRoute = createRoute({
  method: 'post',
  path: '/match/{matchType}/{id}/run_result',
  request: {
    params: PostMatchRunResultRequestPathParamsSchema,
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
