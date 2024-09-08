import { describe, expect, it } from 'vitest';
import { GeneratePreMatchService } from './generatePre';

describe('GeneratePreMatchService', () => {
  const dummyTeamsName = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'C1', 'C2', 'N1', 'N2'];
  const generateService = new GeneratePreMatchService();

  it('正しく予選対戦表を生成できる', async () => {
    const res = await generateService.handle(dummyTeamsName);

    expect(true).toBe(true);
    expect(res[0]).toStrictEqual([
      ['A1', 'B3'],
      ['A4', 'N1'],
      ['B3', 'A1'],
      ['N1', 'A4'],
    ]);
    expect(res[1]).toStrictEqual([
      ['A2', 'C1'],
      ['B1', 'N2'],
      ['C1', 'A2'],
      ['N2', 'B1'],
    ]);
    expect(res[2]).toStrictEqual([
      ['A3', 'C2'],
      ['B2', undefined],
      [undefined, 'A3'],
      ['C2', 'B2'],
    ]);
  });
});
