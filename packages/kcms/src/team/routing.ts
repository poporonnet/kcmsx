import { createRoute } from '@hono/zod-openapi';
import {
  GetTeamsResponseSchema,
  CommonErrorSchema,
  PostTeamsRequestSchema,
  PostTeamsResponseSchema,
  TeamIdParamsSchema,
} from './adaptor/validator/team';

export const GetTeamsRoute = createRoute({
  method: 'get',
  path: '/team',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetTeamsResponseSchema,
        },
      },
      description: 'Retrieve all teams',
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

export const PostTeamsRoute = createRoute({
  method: 'post',
  path: '/team',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: PostTeamsRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PostTeamsResponseSchema,
        },
      },
      description: 'Register teams',
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

export const DeleteTeamRoute = createRoute({
  method: 'delete',
  path: '/team/{teamid}',
  request: {
    params: TeamIdParamsSchema,
  },
  responses: {
    204: {
      description: 'Delete Team',
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
