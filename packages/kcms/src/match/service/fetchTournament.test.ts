import { Result } from '@mikuroxina/mini-fn';
import { afterEach, describe, expect, it } from 'vitest';
import { SnowflakeIDGenerator } from '../../id/main';
import { TeamID } from '../../team/models/team';
import { DummyMainMatchRepository } from '../adaptor/dummy/mainMatchRepository';
import { DummyPreMatchRepository } from '../adaptor/dummy/preMatchRepository';
import { FetchMatchService } from './fetch';
import { FetchTournamentService, Tournament } from './fetchTournament';
import { GenerateMainMatchService } from './generateMain';

describe('FetchTournamentService', () => {
  const idGenerator = new SnowflakeIDGenerator(1, () =>
    BigInt(new Date('2024/01/01 00:00:00 UTC').getTime())
  );
  const preMatchRepository = new DummyPreMatchRepository([]);
  const mainMatchRepository = new DummyMainMatchRepository([]);
  const getMatch = new FetchMatchService(preMatchRepository, mainMatchRepository);
  const fetchTournament = new FetchTournamentService(getMatch);
  const teamIDs = (size: number) => [...Array(size).keys()].map((i) => `${i + 1}` as TeamID);

  afterEach(() => {
    mainMatchRepository.clear();
  });

  it('n=2のとき、トーナメントを取得できる', async () => {
    const generateMainMatch = new GenerateMainMatchService(mainMatchRepository, idGenerator, {
      elementary: 2,
    });
    const matchesRes = await generateMainMatch.handle('elementary', teamIDs(2));
    expect(Result.isErr(matchesRes)).toStrictEqual(false);
    const matches = Result.unwrap(matchesRes);

    const tournamentRes = await fetchTournament.handle('elementary');
    expect(Result.isErr(tournamentRes)).toStrictEqual(false);
    const tournament = Result.unwrap(tournamentRes);

    const expected: Tournament = {
      match: matches[0],
    };
    expect(tournament).toStrictEqual(expected);
  });

  it('n=4のとき、トーナメントを取得できる', async () => {
    const generateMainMatch = new GenerateMainMatchService(mainMatchRepository, idGenerator, {
      elementary: 4,
    });
    const matchesRes = await generateMainMatch.handle('elementary', teamIDs(4));
    expect(Result.isErr(matchesRes)).toStrictEqual(false);
    const matches = Result.unwrap(matchesRes);

    const tournamentRes = await fetchTournament.handle('elementary');
    expect(Result.isErr(tournamentRes)).toStrictEqual(false);
    const tournament = Result.unwrap(tournamentRes);

    // NOTE: `GenerateMainMatchService.handle`の戻り値の配列はラウンドの若い方からかつ左から順に並んでいる
    const expected: Tournament = {
      match: matches[2],
      childMatch1: {
        match: matches[0],
      },
      childMatch2: {
        match: matches[1],
      },
    };
    expect(tournament).toStrictEqual(expected);
  });

  it('n=8のとき、トーナメントを取得できる', async () => {
    const generateMainMatch = new GenerateMainMatchService(mainMatchRepository, idGenerator, {
      elementary: 8,
    });
    const matchesRes = await generateMainMatch.handle('elementary', teamIDs(8));
    expect(Result.isErr(matchesRes)).toStrictEqual(false);
    const matches = Result.unwrap(matchesRes);

    const tournamentRes = await fetchTournament.handle('elementary');
    expect(Result.isErr(tournamentRes)).toStrictEqual(false);
    const tournament = Result.unwrap(tournamentRes);

    // NOTE: `GenerateMainMatchService.handle`の戻り値の配列はラウンドの若い方からかつ左から順に並んでいる
    const expected: Tournament = {
      match: matches[6],
      childMatch1: {
        match: matches[4],
        childMatch1: {
          match: matches[0],
        },
        childMatch2: {
          match: matches[1],
        },
      },
      childMatch2: {
        match: matches[5],
        childMatch1: {
          match: matches[2],
        },
        childMatch2: {
          match: matches[3],
        },
      },
    };
    expect(tournament).toStrictEqual(expected);
  });

  it('決勝が存在しない場合はエラーになる', async () => {
    const tournamentRes = await fetchTournament.handle('elementary');
    expect(Result.isErr(tournamentRes)).toStrictEqual(true);
  });
});
