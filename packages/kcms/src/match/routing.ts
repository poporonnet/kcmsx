import { createRoute } from '@hono/zod-openapi';
import {
  CommonErrorSchema,
  GetMatchResponseSchema,
  GetMatchTypeParamsSchema,
  GetMatchTypeResponseSchema,
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
