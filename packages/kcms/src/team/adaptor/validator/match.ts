import { z } from '@hono/zod-openapi';

const finishStatus = ['goal', 'retired'] as const;

const teamSchema = z.object({
  id: z.string().openapi({ example: '45098607' }),
  teamName: z.string().openapi({ example: 'チーム1' }),
});

const preSchema = z.object({
  id: z.string().openapi({ example: '320984' }),
  matchCode: z.string(),
  leftTeam: teamSchema.or(z.object({})),
  rightTeam: teamSchema.or(z.object({})),
  RunResult: z
    .array(
      z.object({
        id: z.string().openapi({ example: '60980640' }),
        teamId: z.string().openapi({ example: '45098607' }),
        points: z.number().openapi({ example: 4 }),
        finishedTimeSeconds: z.number().openapi({ example: 30 }),
        finishStatus: z.enum(finishStatus).openapi({ example: 'goal' }),
      })
    )
    .max(2),
});

const mainSchema = z.object({
  id: z.string().openapi({ example: '70983405' }),
  matchCode: z.string(),
  team1: teamSchema.or(z.object({})),
  team2: teamSchema.or(z.object({})),
  winnerId: z.string().openapi({ example: '45098607' }),
  RunResult: z
    .array(
      z.object({
        id: z.string().openapi({ example: '60980640' }),
        teamId: z.string().openapi({ example: '45098607' }),
        points: z.number().openapi({ example: 4 }),
        finishedTimeSeconds: z.number().openapi({ example: 30 }),
        finishStatus: z.enum(finishStatus).openapi({ example: 'retired' }),
      })
    )
    .max(4),
});

export const GetMatchResponseSchema = z.object({
  pre: z.array(preSchema),
  main: z.array(mainSchema),
});
