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

export const RunResultSchema = z.object({
  id: z.string().openapi({ example: '60980640' }),
  teamID: z.string().openapi({ example: '45098607' }),
  points: z.number().openapi({ example: 4 }),
  goalTimeSeconds: z.number().nullable().openapi({ example: 30 }),
  finishState: z.enum(['goal', 'finished']).openapi({ example: 'goal' }),
});

export const PreSchema = z.object({
  id: z.string().openapi({ example: '320984' }),
  matchCode: z.string().openapi({ example: '1-3' }),
  matchType: z.literal('pre').openapi({ example: 'pre' }),
  departmentType: z.enum(config.departmentTypes).openapi({ example: config.departments[0].type }),
  leftTeam: BriefTeamSchema,
  rightTeam: BriefTeamSchema,
  runResults: z.array(RunResultSchema).max(2),
});

export const MainSchema = z.object({
  id: z.string().openapi({ example: '70983405' }),
  matchCode: z.string(),
  departmentType: z.enum(config.departmentTypes).openapi({ example: config.departments[0].type }),
  team1: BriefTeamSchema,
  team2: BriefTeamSchema,
  winnerId: z.string().openapi({ example: '45098607' }),
  runResults: z.array(RunResultSchema).max(4),
});

export const ShortPreSchema = PreSchema.omit({
  leftTeam: true,
  rightTeam: true,
}).extend({
  leftTeamID: z.string().optional().openapi({ example: '45098607' }),
  rightTeamID: z.string().optional().openapi({ example: '2230392' }),
});

export const ShortMainSchema = MainSchema.omit({
  team1: true,
  team2: true,
}).extend({
  team1ID: z.string().optional().openapi({ example: '45098607' }),
  team2ID: z.string().optional().openapi({ example: '2230392' }),
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
    name: 'matchID',
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
  matchID: MatchIdSchema,
});

export const GetMatchIdResponseSchema = PreSchema.or(MainSchema);

export const GetMatchRunResultResponseSchema = z.array(RunResultSchema).max(4);

export const GetMatchRunResultParamsSchema = z.object({
  matchType: MatchTypeSchema,
  matchID: MatchIdSchema,
});

export const PostMatchGenerateParamsSchema = z.object({
  matchType: MatchTypeSchema,
  departmentType: DepartmentTypeSchema,
});

export const PostMatchGenerateResponseSchema = z.union([
  ShortPreSchema.array(),
  ShortMainSchema.array(),
]);

export const PostMatchRunResultParamsSchema = z.object({
  matchType: MatchTypeSchema,
  matchID: z.string().openapi({ example: '320984' }),
});

export const PostMatchRunResultRequestSchema = z
  .array(RunResultSchema.omit({ id: true }))
  .max(4)
  .min(1);

export const GetRankingParamsSchema = z.object({
  matchType: MatchTypeSchema,
  departmentType: DepartmentTypeSchema,
});

export const GetRankingResponseSchema = z.array(
  z.object({
    rank: z.number().openapi({ example: 1 }),
    teamID: z.string().openapi({ example: '3098230883' }),
    teamName: z.string().openapi({ example: 'team 1' }),
    points: z.number().openapi({ example: 60 }),
    goalTimeSeconds: z.number().nullable().openapi({ example: 30 }),
  })
);
