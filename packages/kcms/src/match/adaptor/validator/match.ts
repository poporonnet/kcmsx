import { z } from '@hono/zod-openapi';
import { config, pick } from 'config';

export const CommonErrorSchema = z.object({
  description: z.string().openapi({ example: '存在しないカテゴリです' }),
});

const BriefTeamSchema = z
  .object({
    id: z.string().openapi({ example: '45098607' }),
    teamName: z.string().openapi({ example: 'チーム1' }),
  })
  .optional();

const RunResultSchema = z.object({
  id: z.string().openapi({ example: '60980640' }),
  teamID: z.string().openapi({ example: '45098607' }),
  points: z.number().openapi({ example: 4 }),
  goalTimeSeconds: z.number().nullable().openapi({ example: 30 }),
  finishState: z.enum(['goal', 'finished']).openapi({ example: 'goal' }),
});

const PreSchema = z.object({
  id: z.string().openapi({ example: '320984' }),
  matchCode: z.string().openapi({ example: '1-3' }),
  leftTeam: BriefTeamSchema,
  rightTeam: BriefTeamSchema,
  runResults: z.array(RunResultSchema).max(2),
});

const MainSchema = z.object({
  id: z.string().openapi({ example: '70983405' }),
  matchCode: z.string(),
  team1: BriefTeamSchema,
  team2: BriefTeamSchema,
  winnerId: z.string().openapi({ example: '45098607' }),
  runResults: z.array(RunResultSchema).max(4),
});

export const GetMatchResponseSchema = z.object({
  pre: z.array(PreSchema),
  main: z.array(MainSchema),
});

const MatchTypeSchema = z.enum(pick(config.matches, 'type')).openapi({
  param: {
    name: 'matchType',
    in: 'path',
  },
  example: config.matches[1].type,
});

const MatchIdSchema = z.string().openapi({
  param: {
    name: 'matchId',
    in: 'path',
  },
  example: '70983405',
});

const DepartmentTypeSchema = z.enum(pick(config.departments, 'type')).openapi({
  param: {
    name: 'departmentType',
    in: 'path',
  },
  example: config.departments[0].type,
});

export const GetMatchTypeParamsSchema = z.object({
  matchType: MatchTypeSchema,
});

export const GetMatchTypeResponseSchema = z.array(PreSchema.or(MainSchema));

export const GetMatchIdParamsSchema = z.object({
  matchType: MatchTypeSchema,
  matchId: MatchIdSchema,
});

export const GetMatchIdResponseSchema = PreSchema.or(MainSchema);

export const GetMatchRunResultResponseSchema = z.array(RunResultSchema).max(4);

export const GetMatchRunResultParamsSchema = z.object({
  matchType: MatchTypeSchema,
  matchId: MatchIdSchema,
});

export const PostMatchGenerateParamsSchema = z.object({
  matchType: MatchTypeSchema,
  departmentType: DepartmentTypeSchema,
});

export const PostMatchGenerateResponseSchema = z.array(
  PreSchema.omit({
    rightTeam: true,
    leftTeam: true,
  })
    .extend({
      leftTeamID: z.string().optional().openapi({ example: '45098607' }),
      rightTeamID: z.string().optional().openapi({ example: '2230392' }),
    })
    .or(
      MainSchema.omit({
        team1: true,
        team2: true,
      }).extend({
        Team1ID: z.string().optional().openapi({ example: '45098607' }),
        Team2ID: z.string().optional().openapi({ example: '2230392' }),
      })
    )
);