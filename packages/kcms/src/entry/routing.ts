import { createRoute } from '@hono/zod-openapi';
import { TeamResponseSchema } from './adaptor/validator/team';

export const GetTeamRoute = createRoute({
  method: 'get',
  path: '/team',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: TeamResponseSchema,
        },
      },
      description: 'Team list',
    },
  },
});
