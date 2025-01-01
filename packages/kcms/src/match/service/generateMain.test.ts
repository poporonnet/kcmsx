import { Result } from '@mikuroxina/mini-fn';
import { config } from 'config';
import { describe, expect, it } from 'vitest';
import { SnowflakeIDGenerator } from '../../id/main';
import { TeamID } from '../../team/models/team';
import { DummyMainMatchRepository } from '../adaptor/dummy/mainMatchRepository';
import { GenerateMainMatchService } from './generateMain';

describe('GenerateMainMatchService', () => {
  const idGenerator = new SnowflakeIDGenerator(1, () =>
    BigInt(new Date('2024/01/01 00:00:00 UTC').getTime())
  );
  const mainMatchRepository = new DummyMainMatchRepository([]);
  const service = new GenerateMainMatchService(mainMatchRepository, idGenerator);

  it.todo('必要なチーム数に一致しない場合はエラーになる', async () => {
    
  });

  it.todo("n=2のとき、試合が生成できる");

  it.todo("n=4のとき、試合が生成できる");

  it.todo("n=8のとき、試合が生成できる");

  

});
