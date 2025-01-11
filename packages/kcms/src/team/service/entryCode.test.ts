import { Result } from '@mikuroxina/mini-fn';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestEntryData } from '../../testData/entry';
import { DummyRepository } from '../adaptor/repository/dummyRepository';
import { EntryCodeService } from './entryCode';

describe('EntryCodeService', () => {
  const teamRepository = new DummyRepository();
  beforeEach(() => {
    teamRepository.reset([TestEntryData.Entered(), TestEntryData.NotEntered()]);
  });
  it('エントリー時にエントリーコードが連番で割り振られる', async () => {
    const service = new EntryCodeService(teamRepository);
    const teamID = TestEntryData.NotEntered().getID();
    const res = await service.assign(teamID);
    expect(Result.isOk(res)).toBe(true);
    expect(Result.unwrap(res).getEntryCode()).toBe(1);

    const teamID2 = TestEntryData.Entered().getID();
    const res2 = await service.assign(teamID2);
    expect(Result.isOk(res2)).toBe(true);
    expect(Result.unwrap(res2).getEntryCode()).toBe(2);

    const teamID3 = TestEntryData.Entered().getID();
    const res3 = await service.assign(teamID3);
    expect(Result.isOk(res3)).toBe(true);
    expect(Result.unwrap(res3).getEntryCode()).toBe(2);
  });
  it('エントリー済みのチームにはエントリーコードが割り振られない', async () => {
    const service = new EntryCodeService(teamRepository);
    const teamID = TestEntryData.Entered().getID();
    // 1回目の割り当て
    await service.assign(teamID);
    // 2回目の割り当て
    const res = await service.assign(teamID);
    expect(Result.isOk(res)).toBe(true);
    expect(Result.unwrap(res).getEntryCode()).toBe(1);
  });
});
