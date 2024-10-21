import { Option } from '@mikuroxina/mini-fn';
import { beforeEach, describe, expect, it } from 'vitest';
import { DummyMainMatchRepository } from '../../match/adaptor/dummy/mainMatchRepository';
import { DummyPreMatchRepository } from '../../match/adaptor/dummy/preMatchRepository';
import { GetMatchService } from '../../match/service/get';
import { TestEntryData } from '../../testData/entry';
import { DummyRepository } from '../adaptor/repository/dummyRepository';
import { EntryService } from './entry';

describe('EntryService', () => {
  const teamRepository = new DummyRepository([TestEntryData.NotEntered, TestEntryData.Entered]);
  const preMatchRepository = new DummyPreMatchRepository(undefined);
  const mainMatchRepository = new DummyMainMatchRepository(undefined);
  const getMatchService = new GetMatchService(preMatchRepository, mainMatchRepository);
  const service = new EntryService(teamRepository, getMatchService);

  beforeEach(() => {
    preMatchRepository.clear([]);
    mainMatchRepository.clear([]);
  });

  it('エントリーできる', async () => {
    await service.enter(TestEntryData.NotEntered.getId());

    const res = await teamRepository.findByID(TestEntryData.NotEntered.getId());
    expect(Option.isNone(res)).toBe(false);
    expect(Option.unwrap(res).getIsEntered()).toBe(true);
  });

  it('エントリーをキャンセルできる', async () => {
    await service.cancel(TestEntryData.Entered.getId());

    const res = await teamRepository.findByID(TestEntryData.Entered.getId());
    expect(Option.isNone(res)).toBe(false);
    expect(Option.unwrap(res).getIsEntered()).toBe(false);
  });

  it('試合表生成後はエントリーできない', async () => {
    await service.enter(TestEntryData.NotEntered.getId());

    const res = await teamRepository.findByID(TestEntryData.NotEntered.getId());
    expect(Option.isNone(res)).toBe(false);
    expect(Option.unwrap(res).getIsEntered()).toBe(false);
  });

  it('試合表生成後はエントリーをキャンセルできない', async () => {
    await service.cancel(TestEntryData.Entered.getId());

    const res = await teamRepository.findByID(TestEntryData.Entered.getId());
    expect(Option.isNone(res)).toBe(false);
    expect(Option.unwrap(res).getIsEntered()).toBe(true);
  });
});
