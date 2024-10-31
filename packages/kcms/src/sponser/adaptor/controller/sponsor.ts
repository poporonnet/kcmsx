import { z } from '@hono/zod-openapi';
import { Result } from '@mikuroxina/mini-fn';
import { config } from 'config';
import { GetSponsorResponseSchema } from '../validator/sponsor';

export class SponsorController {
  getAll(): Result.Result<Error, z.infer<typeof GetSponsorResponseSchema>> {
    return Result.ok({ sponsor: config.sponsors });
  }
}
