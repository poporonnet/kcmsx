import { createRoute } from '@hono/zod-openapi';
import { TeamsResponseSchema, CommonErrorSchema } from './adaptor/validator/team';

export const GetTeamsRoute = createRoute({
  method: 'get',
  path: '/team',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: TeamsResponseSchema,
        },
      },
      description: 'Team list',
    },
    400: {
      content: {
        'application/json': {
          schema: CommonErrorSchema,
        },
      },
      description: 'Common Error',
    },
  },
});
