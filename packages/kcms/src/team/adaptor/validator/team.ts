import { z } from '@hono/zod-openapi';
import { config, pick } from 'config';

export const CommonErrorSchema = z.object({
  description: z.string().openapi({ example: '存在しないカテゴリです' }),
});

const TeamSchema = z.object({
  id: z.string().openapi({ example: '1392387' }),
  name: z.string().min(1).openapi({ example: 'かに１' }),
  entryCode: z.string().openapi({ example: '1' }),
  members: z
    .array(z.string().min(3))
    .max(2)
    .nonempty()
    .openapi({ example: ['メンバー1', 'メンバー2'] }),
  clubName: z.string().openapi({ example: 'RubyClub' }),
  robotType: z.enum(config.robotTypes).openapi({ example: 'leg' }),
  departmentType: z.enum(pick(config.departments, 'type')).openapi({ example: 'elementary' }),
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

const TeamIDSchema = z.string().openapi({
  param: {
    name: 'teamID',
    in: 'path',
  },
  example: '7549586',
});

export const GetTeamParamsSchema = z.object({
  teamID: TeamIDSchema,
});

export const DeleteTeamParamsSchema = z.object({
  teamID: TeamIDSchema,
});

//ポストメソッドとデリートメソッドで併用
const EntryTeamParamsSchema = z.object({
  teamID: TeamIDSchema,
});

export const PostEntryTeamParamsSchema = EntryTeamParamsSchema;

export const GetTeamResponseSchema = TeamSchema;

export const DeleteEntryTeamParamsSchema = EntryTeamParamsSchema;
