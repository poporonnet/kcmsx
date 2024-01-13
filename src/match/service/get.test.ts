import { describe, expect, it } from 'vitest';
import { DummyMatchRepository } from '../adaptor/dummyRepository.js';
import { GetMatchService, MatchDTO } from './get.js';
import { Result } from '@mikuroxina/mini-fn';
import { TestMatchData } from '../../testData/match.js';

describe('GetMatchService', () => {
  const repository = new DummyMatchRepository();
  repository.create(TestMatchData.ElementaryPrimary);
  const service = new GetMatchService(repository);

  it('取得できる', async () => {
    const res = await service.findById(TestMatchData.ElementaryPrimary.id);

    expect(Result.isErr(res)).toStrictEqual(false);
    expect(res[1]).toStrictEqual(MatchDTO.fromDomain(TestMatchData.ElementaryPrimary));
  });

  it('存在しないときはエラー', async () => {
    const res = await service.findById('222');

    expect(Result.isErr(res)).toStrictEqual(true);
    expect(res[1]).toStrictEqual(new Error('Not found'));
  });
});

describe('MatchDTO', () => {
  const domain = TestMatchData.ElementaryPrimary;

  it('domain dto間で相互変換できる', async () => {
    const toDomain = MatchDTO.fromDomain(domain).toDomain();
    const toDTO = MatchDTO.fromDomain(toDomain);

    expect(toDomain.id).toStrictEqual(toDTO.id);
    expect(toDomain.teams.left!.id).toStrictEqual(toDTO.teams.left!.id);
    expect(toDomain.teams.right!.id).toStrictEqual(toDTO.teams.right!.id);
    expect(toDomain.matchType).toStrictEqual(toDTO.matchType);
    expect(toDomain.courseIndex).toStrictEqual(toDTO.courseIndex);
    expect(toDomain.results).toStrictEqual(toDTO.results);
  });
});
