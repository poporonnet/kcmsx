import { Option, Result } from '@mikuroxina/mini-fn';
import { beforeEach, describe, expect, it } from 'vitest';
import { DummyMainMatchRepository } from '../../match/adaptor/dummy/mainMatchRepository';
import { DummyPreMatchRepository } from '../../match/adaptor/dummy/preMatchRepository';
import { GetMatchService } from '../../match/service/get';
import { TestEntryData } from '../../testData/entry';
import { testCreateRunResultPreData } from '../../testData/match';
import { DummyRepository } from '../adaptor/repository/dummyRepository';
import { EntryService } from './entry';

describe('EntryService', () => {
  const teamRepository = new DummyRepository();
  const preMatchRepository = new DummyPreMatchRepository();
  const mainMatchRepository = new DummyMainMatchRepository();
  const getMatchService = new GetMatchService(preMatchRepository, mainMatchRepository);
  const service = new EntryService(teamRepository, getMatchService);

  const enteredTeamID = TestEntryData.Entered().getID();
  const notEnteredTeamID = TestEntryData.NotEntered().getID();

  beforeEach(() => {
    teamRepository.reset([TestEntryData.Entered(), TestEntryData.NotEntered()]);
  });

  it('エントリーできる', async () => {
    preMatchRepository.clear([]);
    await service.enter(notEnteredTeamID);

    const res = await teamRepository.findByID(notEnteredTeamID);
    expect(Option.isNone(res)).toBe(false);
    expect(Option.unwrap(res).getIsEntered()).toBe(true);
  });

  it('エントリーをキャンセルできる', async () => {
    preMatchRepository.clear([]);
    await service.cancel(enteredTeamID);

    const res = await teamRepository.findByID(enteredTeamID);
    expect(Option.isNone(res)).toBe(false);
    expect(Option.unwrap(res).getIsEntered()).toBe(false);
  });

  it('試合表生成後はエントリーできない', async () => {
    preMatchRepository.clear(testCreateRunResultPreData);
    const res = await service.enter(notEnteredTeamID);

    expect(Result.isErr(res)).toBe(true);
    expect(Result.unwrapErr(res)).toStrictEqual(new Error('Cannot modify entry now'));

    const teamRes = await teamRepository.findByID(notEnteredTeamID);
    expect(Option.isNone(teamRes)).toBe(false);
    expect(Option.unwrap(teamRes).getIsEntered()).toBe(false);
  });

  it('試合表生成後はエントリーをキャンセルできない', async () => {
    preMatchRepository.clear(testCreateRunResultPreData);
    const res = await service.cancel(enteredTeamID);

    expect(Result.isErr(res)).toBe(true);
    expect(Result.unwrapErr(res)).toStrictEqual(new Error('Cannot modify entry now'));

    const teamRes = await teamRepository.findByID(enteredTeamID);
    expect(Option.isNone(teamRes)).toBe(false);
    expect(Option.unwrap(teamRes).getIsEntered()).toBe(true);
  });
});
