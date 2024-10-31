import { z } from '@hono/zod-openapi';

export const CommonErrorSchema = z.object({
  description: z.string().openapi({ example: '存在しないカテゴリです' }),
});

const sponsorSchema = z.object({
  name: z.string().openapi({ example: 'team Poporon Network' }),
  class: z.string().openapi({ example: 'Gold' }),
  url: z.string().url().openapi({ example: 'https://cdn.example.com/poporonnet.png' }),
});

export const GetSponsorResponseSchema = z.object({
  sponsor: z.array(sponsorSchema),
});
