import { z } from '@hono/zod-openapi';
import { config } from 'config';

const TeamSchema = z.object({
  id: z.string().openapi({ example: '1392387' }),
  name: z.string().openapi({ example: 'かに１' }),
  entryCode: z.string().openapi({ example: '1' }),
  menubar: z
    .string()
    .array()
    .max(2)
    .nonempty()
    .openapi({ example: ['メンバー1', 'メンバー2'] }),
  clubName: z.string().openapi({ example: 'RubyClub' }),
  robotType: z.enum(config.robotTypes).openapi({ example: 'leg' }),
  category: z
    .enum(config.departments.map((d) => d.type) as [string, ...string[]])
    .openapi({ example: 'elementary' }),
  isEntered: z.boolean().openapi({ example: true }),
});

export const TeamsSchema = z
  .object({
    teams: z.array(TeamSchema),
  })
  .openapi('Teams');
