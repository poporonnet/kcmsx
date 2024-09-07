import { z } from '@hono/zod-openapi';
import { config, pick } from 'config';

export const CommonErrorSchema = z.object({
  description: z.string().openapi({ example: '存在しないカテゴリです' }),
});

const TeamSchema = z.object({
  id: z.string().openapi({ example: '1392387' }),
  name: z.string().openapi({ example: 'かに１' }),
  entryCode: z.string().openapi({ example: '1' }),
  members: z
    .array(z.string())
    .max(2)
    .nonempty()
    .openapi({ example: ['メンバー1', 'メンバー2'] }),
  clubName: z.string().openapi({ example: 'RubyClub' }),
  robotType: z.enum(config.robotTypes).openapi({ example: 'leg' }),
  category: z.enum(pick(config.departments, 'type')).openapi({ example: 'elementary' }),
  isEntered: z.boolean().openapi({ example: true }),
});

export const TeamsResponseSchema = z
  .object({
    teams: z.array(TeamSchema),
  })
  .openapi('Teams');

export const CommonErrorSchema = z.object({
  description: z.string().openapi({ example: '存在しないカテゴリです' }),
});
