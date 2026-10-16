#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3abdd4b48113898480d9c8fde991daf8f51d55b3b92abd17fa759fac79738e40/contract';
import endContract from '../../snapshots/3abdd4b48113898480d9c8fde991daf8f51d55b3b92abd17fa759fac79738e40/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/797cfed44e9c40efbc00a689b87c92c44cd4b60e1ae3d6ffbc0304d8f348aaf5/contract';
import startContract from '../../snapshots/797cfed44e9c40efbc00a689b87c92c44cd4b60e1ae3d6ffbc0304d8f348aaf5/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Sentence',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('text', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Sentence',
        index: 'Sentence_userId_idx_a489d58a',
        columns: ['userId'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
