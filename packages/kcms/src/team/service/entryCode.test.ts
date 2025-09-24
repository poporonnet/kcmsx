import { Result } from '@mikuroxina/mini-fn';
import { beforeEach, describe, expect, it } from 'vitest';
import { DummyMainMatchRepository } from '../../match/adaptor/dummy/mainMatchRepository';
import { DummyPreMatchRepository } from '../../match/adaptor/dummy/preMatchRepository';
import { FetchMatchService } from '../../match/service/fetch';
import { TestEntryData } from '../../testData/entry';
import { DummyRepository } from '../adaptor/repository/dummyRepository';
import { TeamID } from '../models/team';
import { EntryService } from './entry';
import { EntryCodeService } from './entryCode';

describe('EntryCodeService', () => {
  const teamRepository = new DummyRepository();
  const preMatchRepository = new DummyPreMatchRepository();
  const mainMatchRepository = new DummyMainMatchRepository();
  const getMatchService = new FetchMatchService(preMatchRepository, mainMatchRepository);
  const entryService = new EntryService(teamRepository, getMatchService);
  const entryCodeService = new EntryCodeService(teamRepository);

  beforeEach(() => {
    teamRepository.reset([TestEntryData.Entered(), TestEntryData.NotEntered()]);
  });

  it('エントリー時にエントリーコードが連番で割り振られる', async () => {
    const teamID = '6' as TeamID;
    await entryService.enter(teamID);
    const res = await entryCodeService.setEntryCode(teamID);

    expect(Result.isOk(res)).toBe(true);
    expect(Result.unwrap(res).getEntryCode()).toBe(1);

    const teamID2 = '7' as TeamID;
    await entryService.enter(teamID2);
    const res2 = await entryCodeService.setEntryCode(teamID2);
    expect(Result.isOk(res2)).toBe(true);
    expect(Result.unwrap(res2).getEntryCode()).toBe(2);
  });

  it('エントリー済みのチームにはエントリーコードが割り振られない', async () => {
    const service = new EntryCodeService(teamRepository);
    const teamID = TestEntryData.Entered().getID();
    await entryService.enter(teamID);
    // 1回目の割り当て
    await entryCodeService.setEntryCode(teamID);
    // 2回目の割り当て
    const res = await service.setEntryCode(teamID);
    expect(Result.isOk(res)).toBe(true);
    expect(Result.unwrap(res).getEntryCode()).toBe(1);
  });
});
