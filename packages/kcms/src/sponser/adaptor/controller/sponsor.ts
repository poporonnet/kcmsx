import { z } from '@hono/zod-openapi';
import { Result } from '@mikuroxina/mini-fn';
import { GetSponsorService } from '../../service/getsponsor';
import { GetSponsorResponseSchema } from '../validator/sponsor';

export class SponsorController {
  constructor(private readonly getSponsor: GetSponsorService) {}

  getInf(): Result.Result<Error, z.infer<typeof GetSponsorResponseSchema>> {
    const res = this.getSponsor.getInf();
    if (Result.isErr(res)) return Result.err(res[1]);
    return Result.ok({ sponsor: Result.unwrap(res) });
  }
}
