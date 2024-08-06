import { describe, expect, it } from 'vitest';
import { DummyMainMatchRepository } from '../adaptor/dummy/mainMatchRepository.js';
import { GetMatchService, MatchDTO } from './get.js';
import { Result } from '@mikuroxina/mini-fn';
import { TestMatchData } from '../../testData/match.js';

describe('GetMatchService', () => {
  const repository = new DummyMainMatchRepository();
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
    expect(toDomain.getTeams().left!.getId).toStrictEqual(toDTO.teams.left!.getId);
    expect(toDomain.getTeams().right!.getId).toStrictEqual(toDTO.teams.right!.getId);
    expect(toDomain.getMatchType()).toStrictEqual(toDTO.matchType);
    expect(toDomain.getCourseIndex()).toStrictEqual(toDTO.courseIndex);
    expect(toDomain.getResults()).toStrictEqual(toDTO.results);
  });
});
