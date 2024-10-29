import { Result } from '@mikuroxina/mini-fn';
import { config } from 'config';

type SponsorInf = {
  name: string;
  class: string;
  url: string;
}[];

export class GetSponsorService {
  getInf(): Result.Result<Error, SponsorInf> {
    if (config.sponsors.length === 0) return Result.err(new Error('Not found'));
    return Result.ok(config.sponsors);
  }
}
