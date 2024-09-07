import { describe, expect, it } from 'vitest';
import { DummyRepository } from '../adaptor/dummyRepository';
import { TestEntryData } from '../../testData/entry';
import { EntryService } from './entry';
import { Option } from '@mikuroxina/mini-fn';

describe('EntryService', () => {
  const teamRepository = new DummyRepository([TestEntryData.NotEntered, TestEntryData.Entered]);
  const service = new EntryService(teamRepository);

  it('エントリーできる', async () => {
    await service.entry(TestEntryData.NotEntered.getId());

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
