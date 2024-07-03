import { Result } from '@mikuroxina/mini-fn';

declare const snowflakeBase: unique symbol;

export type SnowflakeID<T> = string & {
  [snowflakeBase]: T;
};

export class SnowflakeIDGenerator {
  // EPOCH: 1640995200 (2022-01-01 00:00:00 UTC)
  private readonly EPOCH = 1640995200000n;
  private readonly WORKER_ID_BIT_LENGTH = 10n;
  private readonly INCREMENTAL_BIT_LENGTH = 12n;
  private readonly MAX_WORKER_ID = (1n << this.WORKER_ID_BIT_LENGTH) - 1n;
  private readonly MAX_INCREMENTAL = (1n << this.INCREMENTAL_BIT_LENGTH) - 1n;

  private readonly workerId: bigint;
  private incremental = 0n;
  private lastTimestamp: bigint;
  private clock: () => bigint;

  constructor(workerId: number, clock: () => bigint) {
    if (workerId < 0n || workerId > this.MAX_WORKER_ID) {
      throw new Error(`worker id must be between 0 and ${this.MAX_WORKER_ID}`);
    }
    this.workerId = BigInt(workerId);
    this.lastTimestamp = 0n;
    this.clock = clock;
  }

  public generate<T>(): Result.Result<Error, SnowflakeID<T>> {
    const timestamp = this.clock();
    const timeFromEpoch = timestamp - this.EPOCH;
    if (timeFromEpoch < 0n) {
      return Result.err(new Error('clock is behind'));
    }

    if (timestamp === this.lastTimestamp) {
      if (this.incremental + 1n > this.MAX_INCREMENTAL) {
        return Result.err(new Error('incremental overflow'));
      }
      this.incremental = (this.incremental + 1n) & this.MAX_INCREMENTAL;
    } else {
      this.incremental = 0n;
    }

    this.lastTimestamp = timestamp;
    const id =
      (timeFromEpoch << (this.WORKER_ID_BIT_LENGTH + this.INCREMENTAL_BIT_LENGTH)) |
      (this.workerId << this.INCREMENTAL_BIT_LENGTH) |
      this.incremental;

    return Result.ok(id.toString() as SnowflakeID<T>);
  }
}
