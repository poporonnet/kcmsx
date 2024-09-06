import { createRoute } from '@hono/zod-openapi';
import { TeamsSchema } from './adaptor/validator/team';

export const route = createRoute({
  method: 'get',
  path: '/team',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: TeamsSchema,
        },
      },
      description: 'Team list',
    },
  },
});
