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
    const res = await service.findById(TestMatchData.ElementaryPrimary.getId());

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

    expect(toDomain.getId()).toStrictEqual(toDTO.id);
    expect(toDomain.getTeams().left!.id).toStrictEqual(toDTO.teams.left!.id);
    expect(toDomain.getTeams().right!.id).toStrictEqual(toDTO.teams.right!.id);
    expect(toDomain.getMatchType()).toStrictEqual(toDTO.matchType);
    expect(toDomain.getCourseIndex()).toStrictEqual(toDTO.courseIndex);
    expect(toDomain.getResults()).toStrictEqual(toDTO.results);
  });
});
