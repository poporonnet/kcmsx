import { createRoute } from '@hono/zod-openapi';
import {
  GetTeamsResponseSchema,
  CommonErrorSchema,
  PostTeamsRequestSchema,
  PostTeamsResponseSchema,
  DeleteTeamParamsSchema,
  PostEntryTeamParamsSchema,
  DeleteEntryTeamParamsSchema,
} from './adaptor/validator/team';
import { GetMatchResponseSchema } from './adaptor/validator/match';

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
  path: '/team/{teamId}',
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
  path: '/team/{teamId}/entry',
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
  path: '/team/{teamId}/entry',
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
