import { createRoute } from '@hono/zod-openapi';
import { CommonErrorSchema, GetSponsorResponseSchema } from './adaptor/validator/sponsor';

export const GetSponsorRoute = createRoute({
  method: 'get',
  path: '/sponsor',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetSponsorResponseSchema,
        },
      },
      description: 'Get all sponsor inf',
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
