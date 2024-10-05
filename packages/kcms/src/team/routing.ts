import { createRoute } from '@hono/zod-openapi';
import {
  GetTeamsResponseSchema,
  CommonErrorSchema,
  PostTeamsRequestSchema,
  PostTeamsResponseSchema,
  DeleteTeamParamsSchema,
  PostEntryTeamParamsSchema,
  DeleteEntryTeamParamsSchema,
  GetTeamParamsSchema,
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

export const GetTeamRoute = createRoute({
  method: 'get',
  path: '/team/{teamID}',
  request: {
    params: GetTeamParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetTeamsResponseSchema,
        },
      },
      description: 'Get Team',
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

export const DeleteTeamRoute = createRoute({
  method: 'delete',
  path: '/team/{teamID}',
  request: {
    params: DeleteTeamParamsSchema,
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

export const PostEntryTeamRoute = createRoute({
  method: 'post',
  path: '/team/{teamID}/entry',
  request: {
    params: PostEntryTeamParamsSchema,
  },
  responses: {
    200: {
      description: 'Entry Team',
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

export const DeleteEntryTeamRoute = createRoute({
  method: 'delete',
  path: '/team/{teamID}/entry',
  request: {
    params: DeleteEntryTeamParamsSchema,
  },
  responses: {
    204: {
      description: 'Delete Entry Team',
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
