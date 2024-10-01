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

export const GetTeamsResponseSchema = z
  .object({
    teams: z.array(TeamSchema),
  })
  .openapi('Teams');

export const PostTeamsRequestSchema = z.array(
  TeamSchema.omit({
    id: true,
    entryCode: true,
    isEntered: true,
  })
);

export const PostTeamsResponseSchema = z.array(TeamSchema).openapi('Teams');

export const DeleteTeamParamsSchema = z.object({
  teamId: z.string().openapi({
    param: {
      name: 'teamId',
      in: 'path',
    },
    example: '7549586',
  }),
});

//ポストメソッドとデリートメソッドで併用
const EntryTeamParamsSchema = z.object({
  teamId: z.string().openapi({
    param: {
      name: 'teamId',
      in: 'path',
    },
    example: '7549586',
  }),
});

export const PostEntryTeamParamsSchema = EntryTeamParamsSchema;
