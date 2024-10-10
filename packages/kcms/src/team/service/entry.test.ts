import { Option } from '@mikuroxina/mini-fn';
import { describe, expect, it } from 'vitest';
import { TestEntryData } from '../../testData/entry';
import { DummyRepository } from '../adaptor/repository/dummyRepository';
import { EntryService } from './entry';

describe('EntryService', () => {
  const teamRepository = new DummyRepository([TestEntryData.NotEntered, TestEntryData.Entered]);
  const service = new EntryService(teamRepository);

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
});
