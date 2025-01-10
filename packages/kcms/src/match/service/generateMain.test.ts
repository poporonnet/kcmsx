import { Result } from '@mikuroxina/mini-fn';
import { afterEach, describe, expect, it } from 'vitest';
import { SnowflakeIDGenerator } from '../../id/main';
import { TeamID } from '../../team/models/team';
import { DummyMainMatchRepository } from '../adaptor/dummy/mainMatchRepository';
import { GenerateMainMatchService } from './generateMain';

describe('GenerateMainMatchService', () => {
  const idGenerator = new SnowflakeIDGenerator(1, () =>
    BigInt(new Date('2024/01/01 00:00:00 UTC').getTime())
  );
  const mainMatchRepository = new DummyMainMatchRepository([]);
  const service = new GenerateMainMatchService(
    mainMatchRepository,
    idGenerator,
    {elementary: 4}
  );

  afterEach(() => {
    mainMatchRepository.clear();
  });

  it('制約が存在しない場合はエラーになる', async () => {
    const res = await new GenerateMainMatchService(mainMatchRepository, idGenerator, {}).handle(
      'elementary',
      ['1'] as TeamID[]
    );
    expect(Result.isErr(res)).toStrictEqual(true);
  });

  it('必要なチーム数に一致しない場合はエラーになる', async () => {
    const res = await service.handle('elementary', ['1', '2'] as TeamID[]);
    expect(Result.isErr(res)).toStrictEqual(true);
  });

  it('n=2のとき、試合が生成できる', async () => {
    const res = await new GenerateMainMatchService(mainMatchRepository, idGenerator, {
      elementary: 2,
    }).handle('elementary', ['1', '2'] as TeamID[]);

    expect(Result.isErr(res)).toStrictEqual(false);
    const actual = Result.unwrap(res);
    expect(actual.length).toStrictEqual(2 - 1);
    const matchNumbers = actual.map((m) => `${m.getCourseIndex()}-${m.getMatchIndex()}`);
    expect(matchNumbers).toStrictEqual(['1-1']);
  });

  it('n=4のとき、試合が生成できる', async () => {
    const res = await new GenerateMainMatchService(mainMatchRepository, idGenerator, {
      elementary: 4,
    }).handle('elementary', ['1', '2', '3', '4'] as TeamID[]);

    expect(Result.isErr(res)).toStrictEqual(false);
    const actual = Result.unwrap(res);
    expect(actual.length).toStrictEqual(4 - 1);

    const matchNumbers = actual.map((m) => `${m.getCourseIndex()}-${m.getMatchIndex()}`);
    expect(matchNumbers).toStrictEqual(['1-1', '2-1', '1-2']);
  });

  it('n=8のとき、試合が生成できる', async () => {
    const res = await new GenerateMainMatchService(mainMatchRepository, idGenerator, {
      elementary: 8,
    }).handle('elementary', ['1', '2', '3', '4', '5', '6', '7', '8'] as TeamID[]);

    expect(Result.isErr(res)).toStrictEqual(false);
    const actual = Result.unwrap(res);
    expect(actual.length).toStrictEqual(8 - 1);
    const matchNumbers = actual.map((m) => `${m.getCourseIndex()}-${m.getMatchIndex()}`);
    expect(matchNumbers).toStrictEqual(['1-1', '2-1', '3-1', '1-2', '1-3', '2-2', '1-4']);
  });

  it('親が存在しない試合は1つだけ生成される', async () => {
    const res = await service.handle('elementary', ['1', '2', '3', '4'] as TeamID[]);
    expect(Result.isErr(res)).toStrictEqual(false);

    const actual = Result.unwrap(res);
    const notHasParentMatches = actual.filter((m) => m.getParentID() === undefined);
    expect(notHasParentMatches.length).toStrictEqual(1);
  });

  it('子が存在しない試合はn/2個生成される', async () => {
    const res = await service.handle('elementary', ['1', '2', '3', '4'] as TeamID[]);
    expect(Result.isErr(res)).toStrictEqual(false);

    const actual = Result.unwrap(res);
    const notHasChildMatches = actual.filter((m) => m.getChildMatches() === undefined);
    expect(notHasChildMatches.length).toStrictEqual(4 / 2);
  });

  it('子も親も存在しないは生成されない', async () => {
    const res = await service.handle('elementary', ['1', '2', '3', '4'] as TeamID[]);
    expect(Result.isErr(res)).toStrictEqual(false);

    const actual = Result.unwrap(res);
    const orphanMatches = actual.filter(
      (m) => m.getChildMatches() === undefined && m.getParentID() === undefined
    );
    expect(orphanMatches.length).toStrictEqual(0);
  });

  it('親/子が設定されている場合、それらの試合は必ず存在する', async () => {
    const res = await service.handle('elementary', ['1', '2', '3', '4'] as TeamID[]);
    expect(Result.isErr(res)).toStrictEqual(false);

    const actual = Result.unwrap(res);
    const hasParent = actual.filter((m) => m.getParentID() !== undefined);
    const hasChild = actual.filter((m) => m.getChildMatches() !== undefined);

    expect(hasParent.length).toStrictEqual(actual.length - 1);
    expect(hasChild.length).toStrictEqual(actual.length - 4 / 2);

    const matchIDs = actual.map((m) => m.getID());

    for (const match of hasParent) {
      expect(matchIDs).toContain(match.getParentID());
    }

    for (const match of hasChild) {
      expect(matchIDs).toContain(match.getChildMatches()?.match1.getID());
      expect(matchIDs).toContain(match.getChildMatches()?.match2.getID());
    }
  });
});
