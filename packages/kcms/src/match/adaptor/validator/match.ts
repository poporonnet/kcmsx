import { z } from '@hono/zod-openapi';

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

const MatchTypeSchema = z.enum(['pre', 'main']).openapi({ example: 'main' });

const MatchIdSchema = z.string().openapi({ example: '70983405' });

export const GetMatchTypeParamsSchema = z.object({
  matchType: MatchTypeSchema,
});

export const GetMatchTypeResponseSchema = PreSchema.or(MainSchema);

export const GetMatchIdSchema = z.object({
  matchType: MatchTypeSchema,
  matchId: MatchIdSchema,
});
